import { Meteor } from "meteor/meteor";
import { EventsCollection } from "../imports/api/collections";
import { Roles } from "meteor/alanning:roles";

Meteor.publish("events.all", function () {
  return EventsCollection.find();
});

Meteor.publish("users.all", () => {
  return [
    Meteor.users.find(),
    Meteor.roles.find(),
    Meteor.roleAssignment.find(), //<--- add this
  ];
});

Meteor.methods({
  async VolunteerForEvent(userId, eventId) {
    const user = await Meteor.users.findOneAsync(userId);
    if (!user) {
      throw new Meteor.Error("User not found");
    }

    Meteor.users.updateAsync(userId, {
      $addToSet: { currentEvents: eventId },
    });
  },

  async RemoveVolunteerFromEvent(userId, eventId) {
    const user = await Meteor.users.findOneAsync(userId);
    if (!user) {
      throw new Meteor.Error("User not found");
    }

    Meteor.users.updateAsync(userId, {
      $pull: { currentEvents: eventId },
    });
  },

  async UpdateUserBio(bio) {
    const userId = await Meteor.userId();

    if (!userId) {
      throw new Meteor.Error("User not found");
    }

    Meteor.users.updateAsync(userId, {
      $set: { bio: bio },
    });
  },

  async UpdateUserSkills(skill, action) {
    const userId = await Meteor.userId();

    if (!userId) {
      throw new Meteor.Error("User not found");
    }

    if (action === "add") {
      Meteor.users.updateAsync(userId, {
        $addToSet: { skills: skill },
      });
    } else if (action === "remove") {
      Meteor.users.updateAsync(userId, {
        $pull: { skills: skill },
      });
    } else {
      throw new Meteor.Error("Invalid action");
    }
  },

  async DeleteEvent(eventId) {
    await EventsCollection.removeAsync(eventId);

    const users = await Meteor.users.find({}).fetch();
    for (const user of users) {
      await Meteor.users.updateAsync(user._id, {
        $pull: { currentEvents: eventId },
      });
    }
  },

  async CompleteEvent(attendance, eventId) {
    for (const [id, isAttending] of Object.entries(attendance)) {
      if (isAttending) {
        await Meteor.users.updateAsync(id, {
          $addToSet: { completedEvents: eventId },
        });
      }
    }
    
    EventsCollection.updateAsync(eventId, { $set: { completed: true } });

    const users = await Meteor.users.find({}).fetch();
    for (const user of users) {
      await Meteor.users.updateAsync(user._id, {
        $pull: { currentEvents: eventId },
      });
    }
  },

  async CreateEvent(eventData) {
    const userId = await Meteor.userId();

    if (!userId) {
      throw new Meteor.Error("User not found");
    }

    const roles = await Roles.getRolesForUserAsync(userId);
    if (!roles.includes("ORG")) {
      throw new Meteor.Error("User does not have the required role");
    }

    const eventId = await EventsCollection.insertAsync({
      ...eventData,
      organizer: userId,
    });

    return eventId;
  },
});
