import React from "react";
import { Navigate } from "react-router-dom";
import { useIsLoggedIn } from "@/hooks/auth";

import PATHS from "./paths";

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = useIsLoggedIn();
  if (isLoggedIn) {
    return <Navigate to={PATHS.CHAT} replace />;
  }
  return children;
};

export default PublicRoute;
