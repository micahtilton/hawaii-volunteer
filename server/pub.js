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

  async GetEmbedding(inputs) {
    const openAiResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Meteor.settings.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        input: inputs,
        model: "text-embedding-ada-002",
      }),
    });

    const data = await openAiResponse.json();
    const embeddings = data.data.map((item) => item.embedding);

    return embeddings;
  },

  async SortEventsByEmbedding(events) {
    const eventStrings = events.map((event) => {
      const eventString = `${event.description} ${event.title} ${
        event.location
      } ${event.summary} ${event.skills.join(", ")}`;
      return eventString;
    })

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("User not found");
    }

    const user = await Meteor.users.findOneAsync(userId);
    const userString = `${user.bio} ${user.skills.join(", ")}`;

    const originalEvents = events;
    const eventsEmbedding = await Meteor.call("GetEmbedding", eventStrings);
    const bioEmbedding = (await Meteor.call("GetEmbedding", [userString]))[0];

    const cosineSimilarity = (a, b) => {
      const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dotProduct / (magnitudeA * magnitudeB);
    };

    const sortedEvents = originalEvents
      .map((event, index) => ({ event, similarity: cosineSimilarity(eventsEmbedding[index], bioEmbedding) }))
      .sort((a, b) => b.similarity - a.similarity)
      .map(({ event }) => event);
    
    return sortedEvents
  },

  async EventToBioSimilarity(event) {
    const eventString = `${event.description} ${event.title} ${
      event.location
    } ${event.summary} ${event.skills.join(", ")}`;

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("User not found");
    }

    const user = await Meteor.users.findOneAsync(userId);
    const userString = `${user.bio} ${user.skills.join(", ")}`;

    const [eventEmbedding, userEmbedding] = await Meteor.call("GetEmbedding", [
      eventString,
      userString,
    ]);

    const cosineSimilarity = (a, b) => {
      const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dotProduct / (magnitudeA * magnitudeB);
    };

    const similarity = cosineSimilarity(eventEmbedding, userEmbedding);
    console.log(similarity);
    return similarity;
  },
});
