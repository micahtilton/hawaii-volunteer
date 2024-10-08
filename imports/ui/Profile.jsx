import { PaperClipIcon } from "@heroicons/react/20/solid";
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Roles } from "meteor/alanning:roles";
import { Meteor } from "meteor/meteor";
import { EventsCollection } from "../api/collections";
import { useNavigate } from "react-router-dom";

Meteor.subscribe("users.all");
Meteor.subscribe("events.all");

const EventRow = ({ event }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const organizer = useTracker(() => Meteor.users.findOne(event.organizer));
  const handleEventClick = (id) => {
    navigate(`/events/${id}`); // Route to the event detail page
  };

  return (
    <div
      className="hover:bg-slate-100 p-3 rounded-md cursor-pointer"
      onClick={(e) => {
        handleEventClick(event._id);
      }}
    >
      <h3 className="text-lg font-semibold leading-6 text-gray-900">
        {event.title}
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-500">{event.location}</p>
      <p className="mt-1 text-sm leading-6 text-gray-700">{event.summary}</p>
      <p className="mt-1 text-xs leading-5 text-gray-500">
        Contact: {organizer.emails[0].address}
      </p>
    </div>
  );
};

export default function Profile() {
  const { user } = useTracker(() => {
    const user = Meteor.user();
    const roles = Roles.getRolesForUser(Meteor.userId());
    return { user: { ...user, roles } }; // Combine user and roles into one object
  }, []);

  const currentEvents = useTracker(() => {
    if (!user._id) return [];
    return EventsCollection.find({ _id: { $in: user.currentEvents } }).fetch();
  });

  const completedEvents = useTracker(() => {
    if (!user._id) return [];
    return EventsCollection.find({
      _id: { $in: user.completedEvents },
    }).fetch();
  });
  
  if (!user._id) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto">
      {/* <div>{JSON.stringify(user.completedEvents)}</div> */}
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.username}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Bio</dt>
            <div className="overflow-auto mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="flex items-center">
                <span>{user.bio}</span>
                <button
                  className="ml-2 text-indigo-600 hover:underline"
                  onClick={() => {
                    const newBio = prompt("Edit your bio:", user.bio);
                    if (newBio !== null) {
                      Meteor.call("UpdateUserBio", newBio); // Assuming you have a method to update the bio
                    }
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Email address
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.emails[0].address}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Skills
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.skills.map((skill) => (
                <div key={skill} className="flex items-center">
                  <button
                    className="text-red-600 hover:text-red-500"
                    onClick={() => {
                      Meteor.call("UpdateUserSkills", skill, "remove"); // Assuming you have a method to remove the skill
                    }}
                  >
                    ✖
                  </button>
                  <span className="ml-2">{skill}</span>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add a new skill"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    Meteor.call("UpdateUserSkills", e.target.value, "add"); // Assuming you have a method to add the skill
                    e.target.value = ""; // Clear the input field
                  }
                }}
                className="mt-2 border border-gray-300 rounded-md pl-2"
              />
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Current Events
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {currentEvents.map((event) => (
                <EventRow event={event} />
              ))}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Completed Events
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {completedEvents.map((event) => (
                <EventRow event={event} />
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
