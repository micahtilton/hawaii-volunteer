import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignIn } from "./SignIn";
import Home from "./Home";
import Header from "./Header";
import { useTracker } from "meteor/react-meteor-data";
import Profile from "./Profile";
import SearchEvents from "./SearchEvents";
import EventDetail from "./EventDetail";
import Organization from "./Organization";
import OrganizationEventDetail from "./OrganizationEventDetail";

const ProtectedRoute = ({ role, element }) => {
  const { user } = useTracker(() => {
    const user = Meteor.user();
    const roles = Roles.getRolesForUser(user?._id);
    return { user: { ...user, roles } }; // Combine user and roles into one object
  }, []);
  
  const loggedIn = !!user._id; // Determine if the user is logged in
  let authorized;
  if (!role) {
    authorized = loggedIn;
  } else {
    authorized = loggedIn && user.roles.includes(role); // Check if the user has the required role
  }

  return authorized ? element : <div>You are not authorized to view this page.</div>;
};

export const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/events" element={<SearchEvents />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/organization" element={<ProtectedRoute role={"ORG"} element={<Organization />} />} />
        <Route path="/organization/events/:id" element={<ProtectedRoute role={"ORG"} element={<OrganizationEventDetail />} />} />
        <Route path="/events/:id" element={<EventDetail />} />
      </Routes>
    </Router>
  );
};
