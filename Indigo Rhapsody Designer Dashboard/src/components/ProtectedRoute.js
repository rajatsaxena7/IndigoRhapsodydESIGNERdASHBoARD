import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../service/cookieService";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated using cookies
  return isAuthenticated() ? children : React.createElement(Navigate, { to: "/login" });
};

export default ProtectedRoute;
