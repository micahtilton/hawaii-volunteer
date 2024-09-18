import { Meteor } from "meteor/meteor";
import { EventsCollection } from "../imports/api/collections";

Meteor.publish("events.all", function() {
  return EventsCollection.find();
});

Meteor.publish('users.all', () => {
  return [
      Meteor.users.find(),
      Meteor.roles.find(),
      Meteor.roleAssignment.find() //<--- add this
  ];
});

Meteor.methods({
  async VolunteerForEvent(userId, eventId) {
    const user = await Meteor.users.findOneAsync(userId);
    if (!user) {
      throw new Meteor.Error("User not found");
    }

    Meteor.users.updateAsync(userId, {
      $addToSet: { currentEvents: eventId }
    });
  },

  async RemoveVolunteerFromEvent(userId, eventId) {
    const user = await Meteor.users.findOneAsync(userId);
    if (!user) {
      throw new Meteor.Error("User not found");
    }

    Meteor.users.updateAsync(userId, {
      $pull: { currentEvents: eventId }
    });
  }
});
