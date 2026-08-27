export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",

  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    VEHICLES: "/admin/vehicles",
    MAINTENANCE_TYPES: "/admin/maintenance-types",
    MAINTENANCE_RECORDS: "/admin/maintenance-records",
    MAINTENANCE_REQUESTS: "/admin/maintenance-requests",
    SETTINGS: "/admin/settings",
  },

  USER: {
    ROOT: "/user",
    DASHBOARD: "/user/dashboard",
    VEHICLES: "/user/vehicles",
    NEW_REQUEST: "/user/maintenance-requests/new",
    MY_REQUESTS: "/user/maintenance-requests",
    SETTINGS: "/user/settings",
  },

  UNAUTHORIZED: "/unauthorized",
  NOT_FOUND: "*",
} as const;