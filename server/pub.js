import { Meteor } from "meteor/meteor";
import { EventsCollection } from "../imports/api/collections";

Meteor.publish("allEvents", function() {
  return EventsCollection.find();
});