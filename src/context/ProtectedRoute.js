import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    // Redirect to the login page if no user is logged in
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

export default ProtectedRoute;
