import React from "react";
import { Navigate } from "react-router-dom";

import PATHS from "./paths";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = TODO_useAuth();
  if (!isLoggedIn) {
    return <Navigate to={PATHS.LOGIN} />;
  }
  return children;
};

function TODO_useAuth() {
  // todo:
  return { isLoggedIn: Math.random() > 0.5 };
}

export default ProtectedRoute;
