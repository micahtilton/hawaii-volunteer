import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { EventsCollection } from "../api/collections";
import { Tracker } from "meteor/tracker";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

Tracker.autorun(() => {
  Meteor.subscribe("events.all");
});

export default SearchEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const events = useTracker(() => {
    return EventsCollection.find({}).fetch();
  });

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate(); // Initialize useNavigate

  const handleEventClick = (id) => {
    navigate(`/events/${id}`); // Route to the event detail page
  };

  return (
    <div className="container mx-auto">
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-2 border border-gray-300 rounded block mx-auto"
      />
      <ul role="list" className="divide-y divide-gray-200">
        {filteredEvents.map((event) => (
          <li
            key={event._id}
            className="flex justify-between gap-x-6 p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => handleEventClick(event._id)}
          >
            {" "}
            {/* Add onClick to li */}
            <div className="flex min-w-0 gap-x-4">
              <img
                alt={event.title}
                src={event.image}
                className="flex-none rounded-md bg-gray-50 object-cover w-1/4"
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {event.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {event.location}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {event.summary}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Recommended Skills: {event.skills.join(", ")}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Contact: {event.contact}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Start: {event.startDate.toLocaleString()}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  End: {event.endDate.toLocaleString()}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
