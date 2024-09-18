import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { EventsCollection } from "../api/collections";
import { Tracker } from "meteor/tracker";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { useEffect } from "react";

Tracker.autorun(() => {
  Meteor.subscribe("events.all");
});

function eventToString(event) {
  const eventString = `${event.description} ${event.title} ${event.location} ${
    event.summary
  } ${event.skills.join(", ")}`;
  return eventString;
}

export function EventRow({ event, handleEventClick }) {
  const organizer = useTracker(() => Meteor.users.findOne(event.organizer));

  return (
    <li
      className="flex justify-between gap-x-6 p-4 cursor-pointer hover:bg-gray-100"
      onClick={() => handleEventClick(event._id)}
    >
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
            Contact: {organizer.emails[0].address}
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
  );
}

export default SearchEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [aiSort, setAiSort] = useState(false);
  const [sortedEvents, setSortedEvents] = useState([]);
  const userId = useTracker(() => Meteor.userId())

  const events = useTracker(() => {
    return EventsCollection.find({}).fetch();
  });

  const notCompletedEvents = events.filter((event) => !event.completed);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleEventClick = (id) => {
    navigate(`/events/${id}`); // Route to the event detail page
  };

  useEffect(() => {
    if (aiSort && sortedEvents.length === 0) {
      Meteor.callAsync("SortEventsByEmbedding", notCompletedEvents).then(
        (res) => {
          setSortedEvents(res);
          setAiSort(false);
        }
      );
    }
  }, [aiSort]);

  const eventsToDisplay =
    !aiSort && sortedEvents.length === 0 ? notCompletedEvents : sortedEvents;
  const filteredEvents = eventsToDisplay.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="m-2 p-1 pl-2 border border-gray-300 rounded"
        />
        {userId && <span className="flex items-center">
          <button
            onClick={(e) => {
              setAiSort(true);
            }}
            className="mr-2 p-1 bg-blue-500 text-white hover:bg-blue-600 rounded"
          >
            Sort with AI
          </button>
        </span>}
      </div>
      {aiSort && <div className="text-center">Sorting...</div>}
      <ul role="list" className="divide-y divide-gray-200">
        {filteredEvents.map((event) => (
          <EventRow
            key={event._id}
            event={event}
            handleEventClick={handleEventClick}
          />
        ))}
      </ul>
    </div>
  );
};
