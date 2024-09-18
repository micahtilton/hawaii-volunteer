import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { EventsCollection } from "../api/collections"; // Adjust the import path as necessary
import { useState } from "react";

const CompleteButton = ({
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
      Complete
    </button>
  );
};

const OrganizationEventDetail = () => {
  const { id } = useParams(); // Get the event ID from the URL parameters
  const event = useTracker(() => EventsCollection.findOne(id), [id]); // Fetch the event data using the ID
  const user = useTracker(() => Meteor.user(), []);
  const organizer = useTracker(() => Meteor.users.findOne(event.organizer));
  const [attendance, setAttendance] = useState({});
  const navigate = useNavigate();

  const registeredUsers = useTracker(() => {
    return Meteor.users.find({ currentEvents: { $in: [id] } }).fetch();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>; // Handle loading state
  }

  const handleComplete = () => {
    if (window.confirm("Are you sure you want to complete this event?")) {
      Meteor.call("CompleteEvent", attendance, event._id);
      navigate("/organization");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      Meteor.call("DeleteEvent", event._id);
      navigate("/organization");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* <div>{JSON.stringify(registeredUsers)}</div> */}
      <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
      <img
        alt={event.title}
        src={event.image}
        className="mt-4 rounded-md bg-gray-50 object-cover w-full h-48"
      />
      <p className="mt-2 text-sm text-gray-500">{event.location}</p>
      <p className="mt-2 text-base text-gray-700">{event.description}</p>
      <p className="mt-2 text-xs text-gray-500">
        Contact: {organizer.emails[0].address}
      </p>
      <p className="mt-2 text-xs text-gray-500">
        Start Time: {event.startDate.toLocaleString()}
      </p>
      <p className="mt-2 text-xs text-gray-500">
        End Time: {event.endDate.toLocaleString()}
      </p>
      <p className="mt-2 text-xs text-gray-500">
        Recommended Skills: {event.skills.join(", ")}
      </p>

      <h2 className="mt-3 text-2xl font-bold text-gray-900">Attendance</h2>
      <ul className="">
        {registeredUsers.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between p-2 border-b"
          >
            <span className="text-gray-700">{user.emails[0].address}</span>
            <input
              type="checkbox"
              className="ml-4"
              onChange={(e) => {
                attendance[user._id] = e.target.checked;
                console.log(attendance);
              }}
            />
          </li>
        ))}
      </ul>
      {!event.completed && (
        <div className="flex gap-2">
          <button
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
            onClick={handleComplete}
          >
            Complete
          </button>
          <button
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500"
            onClick={handleDelete}
          >
            Delete Event
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizationEventDetail;
