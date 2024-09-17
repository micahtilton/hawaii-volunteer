import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignIn } from "./SignIn";
import Home from "./Home";
import Header from "./Header";
import { useTracker } from "meteor/react-meteor-data";
import Profile from "./Profile";
import SearchEvents from "./SearchEvents";

const ProtectedRoute = ({ element }) => {
  const user = useTracker(() => Meteor.user(), []);
  const loggedIn = !!user;
  return loggedIn ? element : <div>You are not authorized to view this page.</div>;
};

export const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/search" element={<SearchEvents />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      </Routes>
    </Router>
  );
};
