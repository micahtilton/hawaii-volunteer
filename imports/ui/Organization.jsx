import { useTracker } from "meteor/react-meteor-data";
import React from "react";
import { EventsCollection } from "../api/collections";
import { EventRow } from "./SearchEvents";
import { useNavigate } from "react-router-dom";

const Organization = () => {
  const user = useTracker(() => Meteor.user(), []);
  const events = useTracker(() => {
    if (user) {
      return EventsCollection.find({ organizer: user._id, completed: false }).fetch();
    }
    return [];
  }, [user]);

  const navigation = useNavigate()

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Your Events</h1>
      <div className="flex justify-center pb-2">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
          onClick={() => navigation('/organization/events/create')}
        >
          Create Event
        </button>
      </div>
      <ul>
        {events.map(event => (
          <EventRow event={event} handleEventClick={() => {navigation(`/organization/events/${event._id}`)}}/>
        ))}
      </ul>
      <p className="mt-4">
        Welcome to our organization! We are dedicated to community service and environmental protection.
      </p>
      <h2 className="mt-6 text-xl font-semibold">Our Mission</h2>
      <p>
        Our mission is to create impactful projects that benefit the local community and foster a culture of service and sustainability.
      </p>
      <h2 className="mt-6 text-xl font-semibold">Get Involved</h2>
      <p>
        Join us in our efforts to make a positive impact! We welcome volunteers who are passionate about making a difference.
      </p>
    </div>
  );
};

export default Organization;
