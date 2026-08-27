import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { PlaceholderPage } from "../components/common/PlaceholderPage";
import { DashboardLayout } from "../layouts/DashboardLayout";

import { ROUTES } from "../constants/routes";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          <PlaceholderPage
            title="Fleet Care"
            description="A smarter way to manage vehicles and maintenance."
          />
        }
      />

      <Route
        path={ROUTES.LOGIN}
        element={
          <PlaceholderPage title="Welcome Back" />
        }
      />

      <Route element={<DashboardLayout role="Admin" />}>
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
            element={
            <PlaceholderPage title="Admin Dashboard" />
            }
        />

        <Route
            path={ROUTES.ADMIN.VEHICLES}
            element={
            <PlaceholderPage title="Vehicles" />
            }
        />

        <Route
            path={ROUTES.ADMIN.MAINTENANCE_TYPES}
            element={
            <PlaceholderPage title="Maintenance Types" />
            }
        />

        <Route
            path={ROUTES.ADMIN.MAINTENANCE_RECORDS}
            element={
            <PlaceholderPage title="Maintenance Records" />
            }
        />

        <Route
            path={ROUTES.ADMIN.MAINTENANCE_REQUESTS}
            element={
            <PlaceholderPage title="Maintenance Requests" />
            }
        />

        <Route
            path={ROUTES.ADMIN.SETTINGS}
            element={
            <PlaceholderPage title="Settings" />
            }
        />
        </Route>

      <Route
        path={ROUTES.ADMIN.DASHBOARD}
        element={
          <PlaceholderPage title="Admin Dashboard" />
        }
      />

      <Route
        path={ROUTES.ADMIN.VEHICLES}
        element={
          <PlaceholderPage title="Vehicles" />
        }
      />

      <Route
        path={ROUTES.ADMIN.MAINTENANCE_TYPES}
        element={
          <PlaceholderPage title="Maintenance Types" />
        }
      />

      <Route
        path={ROUTES.ADMIN.MAINTENANCE_RECORDS}
        element={
          <PlaceholderPage title="Maintenance Records" />
        }
      />

      <Route
        path={ROUTES.ADMIN.MAINTENANCE_REQUESTS}
        element={
          <PlaceholderPage title="Maintenance Requests" />
        }
      />

      <Route element={<DashboardLayout role="User" />}>
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
      <PlaceholderPage title="My Dashboard" />
    }
  />

  <Route
    path={ROUTES.USER.VEHICLES}
    element={
      <PlaceholderPage title="Available Vehicles" />
    }
  />

  <Route
    path={ROUTES.USER.NEW_REQUEST}
    element={
      <PlaceholderPage title="New Maintenance Request" />
    }
  />

  <Route
    path={ROUTES.USER.MY_REQUESTS}
    element={
      <PlaceholderPage title="My Maintenance Requests" />
    }
  />

  <Route
    path={ROUTES.USER.SETTINGS}
    element={
      <PlaceholderPage title="Settings" />
    }
  />
</Route>

      <Route
        path={ROUTES.USER.DASHBOARD}
        element={
          <PlaceholderPage title="My Dashboard" />
        }
      />

      <Route
        path={ROUTES.USER.VEHICLES}
        element={
          <PlaceholderPage title="Available Vehicles" />
        }
      />

      <Route
        path={ROUTES.USER.NEW_REQUEST}
        element={
          <PlaceholderPage title="New Maintenance Request" />
        }
      />

      <Route
        path={ROUTES.USER.MY_REQUESTS}
        element={
          <PlaceholderPage title="My Maintenance Requests" />
        }
      />

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
  );
}