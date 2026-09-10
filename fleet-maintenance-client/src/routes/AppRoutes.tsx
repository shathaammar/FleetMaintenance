import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { PlaceholderPage } from "../components/common/PlaceholderPage";
import { ROUTES } from "../constants/routes";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { LandingPage } from "../pages/public/LandingPage";

const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage").then(({ AdminDashboardPage }) => ({ default: AdminDashboardPage })));
const AdminMaintenanceRecordsPage = lazy(() => import("../pages/admin/AdminMaintenanceRecordsPage").then(({ AdminMaintenanceRecordsPage }) => ({ default: AdminMaintenanceRecordsPage })));
const AdminMaintenanceRequestsPage = lazy(() => import("../pages/admin/AdminMaintenanceRequestsPage").then(({ AdminMaintenanceRequestsPage }) => ({ default: AdminMaintenanceRequestsPage })));
const AdminMaintenanceTypesPage = lazy(() => import("../pages/admin/AdminMaintenanceTypesPage").then(({ AdminMaintenanceTypesPage }) => ({ default: AdminMaintenanceTypesPage })));
const AdminVehiclesPage = lazy(() => import("../pages/admin/AdminVehiclesPage").then(({ AdminVehiclesPage }) => ({ default: AdminVehiclesPage })));
const LoginPage = lazy(() => import("../pages/auth/LoginPage").then(({ LoginPage }) => ({ default: LoginPage })));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage").then(({ RegisterPage }) => ({ default: RegisterPage })));
const SettingsPage = lazy(() => import("../pages/shared/SettingsPage").then(({ SettingsPage }) => ({ default: SettingsPage })));
const UserCreateMaintenanceRequestPage = lazy(() => import("../pages/user/UserCreateMaintenanceRequestPage").then(({ UserCreateMaintenanceRequestPage }) => ({ default: UserCreateMaintenanceRequestPage })));
const UserDashboardPage = lazy(() => import("../pages/user/UserDashboardPage").then(({ UserDashboardPage }) => ({ default: UserDashboardPage })));
const UserMaintenanceRequestsPage = lazy(() => import("../pages/user/UserMaintenanceRequestsPage").then(({ UserMaintenanceRequestsPage }) => ({ default: UserMaintenanceRequestsPage })));
const UserVehiclesPage = lazy(() => import("../pages/user/UserVehiclesPage").then(({ UserVehiclesPage }) => ({ default: UserVehiclesPage })));

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          <LandingPage />
        }
      />

      <Route element={<PublicOnlyRoute />}>
        <Route
          path={ROUTES.LOGIN}
          element={<LoginPage />}
        />
      </Route>

      <Route
        path={ROUTES.REGISTER}
        element={<RegisterPage />}
      />

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["Admin"]}
          />
        }
      >
        <Route
          element={
            <DashboardLayout role="Admin" />
          }
        >
          <Route
            path={ROUTES.ADMIN.ROOT}
            element={
              <Navigate
                to={ROUTES.ADMIN.DASHBOARD}
                replace
              />
            }
          />

          <Route
            path={ROUTES.ADMIN.DASHBOARD}
            element={<AdminDashboardPage />}
          />

          <Route
            path={ROUTES.ADMIN.VEHICLES}
            element={
              <AdminVehiclesPage />
            }
          />

          <Route
            path={ROUTES.ADMIN.MAINTENANCE_TYPES}
            element={
              <AdminMaintenanceTypesPage />
            }
          />

          <Route
            path={
              ROUTES.ADMIN.MAINTENANCE_RECORDS
            }
            element={
              <AdminMaintenanceRecordsPage />
            }
          />

          <Route
            path={
              ROUTES.ADMIN.MAINTENANCE_REQUESTS
            }
            element={
              <AdminMaintenanceRequestsPage />
            }
          />

          <Route
            path={ROUTES.ADMIN.SETTINGS}
            element={
              <SettingsPage />
            }
          />
        </Route>
      </Route>

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["User"]}
          />
        }
      >
        <Route
          element={
            <DashboardLayout role="User" />
          }
        >
          <Route
            path={ROUTES.USER.ROOT}
            element={
              <Navigate
                to={ROUTES.USER.DASHBOARD}
                replace
              />
            }
          />

          <Route
            path={ROUTES.USER.DASHBOARD}
            element={
              <UserDashboardPage />
            }
          />

          <Route
            path={ROUTES.USER.VEHICLES}
            element={
              <UserVehiclesPage />
            }
          />

          <Route
            path={ROUTES.USER.NEW_REQUEST}
            element={
              <UserCreateMaintenanceRequestPage />
            }
          />

          <Route
            path={ROUTES.USER.MY_REQUESTS}
            element={
              <UserMaintenanceRequestsPage />
            }
          />

          <Route
            path={ROUTES.USER.SETTINGS}
            element={
              <SettingsPage />
            }
          />
        </Route>
      </Route>

      <Route
        path={ROUTES.UNAUTHORIZED}
        element={
          <PlaceholderPage
            title="Access Denied"
            description="You do not have permission to access this page."
          />
        }
      />

      <Route
        path={ROUTES.NOT_FOUND}
        element={
          <PlaceholderPage
            title="Page Not Found"
            description="The page you are looking for does not exist."
          />
        }
      />
      </Routes>
    </Suspense>
  );
}