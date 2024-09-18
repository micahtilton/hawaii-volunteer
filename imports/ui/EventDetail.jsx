import React from "react";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { EventsCollection } from "../api/collections"; // Adjust the import path as necessary

const VolunteerButton = ({
  isVolunteering,
  handleRemoveVolunteer,
  confirmVolunteer,
}) => {
  return isVolunteering ? (
    <button
      className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500"
      onClick={handleRemoveVolunteer}
    >
      Remove Volunteer
    </button>
  ) : (
    <button
      className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
      onClick={confirmVolunteer}
    >
      Volunteer
    </button>
  );
};

const EventDetail = () => {
  const { id } = useParams(); // Get the event ID from the URL parameters
  const event = useTracker(() => EventsCollection.findOne(id), [id]); // Fetch the event data using the ID
  const user = useTracker(() => Meteor.user(), []);

  if (!event) {
    return <div>Loading...</div>; // Handle loading state
  }

  const handleVolunteer = () => {
    console.log("User has volunteered for the event:", event.title);
  };

  const confirmVolunteer = () => {
    if (window.confirm("Are you sure you want to volunteer for this event?")) {
      handleVolunteer();
      Meteor.call("VolunteerForEvent", user._id, id);
    }
  };

  const handleRemoveVolunteer = () => {
    if (window.confirm("Are you sure you want to remove volunteer for this event?")) {
      console.log(
        "User has removed their volunteer status for the event:",
        event.title
      );
      Meteor.call("RemoveVolunteerFromEvent", user._id, id);
    }
  };

  const isVolunteering = user
    ? user.currentEvents && user.currentEvents.includes(id)
    : false;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* <div>{JSON.stringify(user)}</div> */}
      <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
      <img
        alt={event.title}
        src={event.image}
        className="mt-4 rounded-md bg-gray-50 object-cover w-full h-48"
      />
      <p className="mt-2 text-sm text-gray-500">
        {event.location}
      </p>
      <p className="mt-2 text-base text-gray-700">{event.description}</p>
      <p className="mt-2 text-xs text-gray-500">Contact: {event.contact}</p>
      <p className="mt-2 text-xs text-gray-500">Start Time: {event.startDate.toLocaleString()}</p>
      <p className="mt-2 text-xs text-gray-500">End Time: {event.endDate.toLocaleString()}</p>
      <p className="mt-2 text-xs text-gray-500">Recommended Skills: {event.skills.join(', ')}</p>
      {!!user && (
        <VolunteerButton
          confirmVolunteer={confirmVolunteer}
          isVolunteering={isVolunteering}
          handleRemoveVolunteer={handleRemoveVolunteer}
        />
      )}
    </div>
  );
};

export default EventDetail;
