import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";

export function PublicOnlyRoute() {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  if (isAuthenticated && user) {
    const dashboardPath =
      user.role === "Admin"
        ? ROUTES.ADMIN.DASHBOARD
        : ROUTES.USER.DASHBOARD;

    return (
      <Navigate
        to={dashboardPath}
        replace
      />
    );
  }

  return <Outlet />;
}