import { Meteor } from "meteor/meteor";
import { EventsCollection } from "../imports/api/collections";

Meteor.publish("allEvents", function() {
  return EventsCollection.find();
});

Meteor.publish('users.all', () => {
  return [
      Meteor.users.find(),
      Meteor.roles.find(),
      Meteor.roleAssignment.find() //<--- add this
  ];
});