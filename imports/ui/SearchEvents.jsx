import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { EventsCollection } from "../api/collections";
import { Tracker } from "meteor/tracker";
import { useState } from "react";

Tracker.autorun(() => {
  Meteor.subscribe("allEvents");
});

const EventList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const events = useTracker(() => {
    return EventsCollection.find({}).fetch();
  });

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <li key={event.title} className="flex justify-between gap-x-6 py-5">
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
                  {event.date} - {event.location}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {event.description}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Contact: {event.contact}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Time: {event.time}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  id: {event._id}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function SearchEvents() {
  return (
    <EventList />
    // <ul role="list" className="divide-y divide-gray-100">
    //   {people.map((person) => (
    //     <li key={person.email} className="flex justify-between gap-x-6 py-5">
    //       <div className="flex min-w-0 gap-x-4">
    //         <img alt="" src={"volunteer.jpg"} className="h-12 w-12 flex-none rounded-full bg-gray-50" />
    //         <div className="min-w-0 flex-auto">
    //           <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
    //           <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.email}</p>
    //         </div>
    //       </div>
    //       <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
    //         <p className="text-sm leading-6 text-gray-900">{person.role}</p>
    //         {person.lastSeen ? (
    //           <p className="mt-1 text-xs leading-5 text-gray-500">
    //             Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
    //           </p>
    //         ) : (
    //           <div className="mt-1 flex items-center gap-x-1.5">
    //             <div className="flex-none rounded-full bg-emerald-500/20 p-1">
    //               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
    //             </div>
    //             <p className="text-xs leading-5 text-gray-500">Online</p>
    //           </div>
    //         )}
    //       </div>
    //     </li>
    //   ))}
    // </ul>
  );
}
