import React from "react";
import { useTracker } from "meteor/react-meteor-data";

export default function Home() {
    const user = useTracker(() => Meteor.user(), []);
    const loggedIn = !!user; // Determine if the user is logged in
    const heroText =
      loggedIn
        ? `Aloha mai E ${user.username}, We are happy to see you!`
        : "ʻAʻohe hana nui ke alu ʻia";
  
    return (
      <div className="bg-white">
        {/* <div>{JSON.stringify(user)}</div> */}
        <div className="relative isolate px-6 lg:px-8 bg-slate-100">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          ></div>
          <div className="mx-auto max-w-2xl py-20">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                No task is too big when done together by all.{" "}
                <a href="/events" className="font-semibold text-indigo-600">
                  <span aria-hidden="true" className="absolute inset-0" />
                  Volunteer <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                {heroText}
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our mission is to connect passionate volunteers with meaningful
                opportunities that enrich the community and preserve the natural
                beauty of Hawaii. Together, we strive to foster a spirit of aloha
                through dedicated service, cultural education, and environmental
                stewardship.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/events"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          ></div>
        </div>
      </div>
    );
  }
  