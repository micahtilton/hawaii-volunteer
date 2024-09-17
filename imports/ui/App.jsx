import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignIn } from "./SignIn";
import Home from "./Home";
import Header from "./Header";

export const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn></SignIn>} />
      </Routes>
    </Router>
  );
};
