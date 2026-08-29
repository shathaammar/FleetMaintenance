import {
  Bell,
  Menu,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Outlet,
  useLocation,
} from "react-router-dom";

import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { useAuth } from "../hooks/useAuth";

type UserRole = "Admin" | "User";

interface DashboardLayoutProps {
  role: UserRole;
}

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard Overview",
  "/admin/vehicles": "Vehicle Management",
  "/admin/maintenance-types": "Maintenance Types",
  "/admin/maintenance-records": "Maintenance Records",
  "/admin/maintenance-requests": "Maintenance Requests",
  "/admin/settings": "Settings",

  "/user/dashboard": "My Dashboard",
  "/user/vehicles": "Available Vehicles",
  "/user/maintenance-requests/new":
    "New Maintenance Request",
  "/user/maintenance-requests":
    "My Maintenance Requests",
  "/user/settings": "Settings",
};

export function DashboardLayout({
  role,
}: DashboardLayoutProps) {
  const location = useLocation();

  const { user } = useAuth();

  const userInitials =
    user?.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0])
      .join("")
      .toUpperCase() ??
    (role === "Admin" ? "FA" : "FU");

  const [isCollapsed, setIsCollapsed] =
    useState(false);

  const pageTitle = useMemo(() => {
    return (
      pageTitles[location.pathname] ??
      "Fleet Maintenance"
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-text-main">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 size-[420px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="absolute bottom-0 left-1/3 size-[360px] rounded-full bg-blue-500/5 blur-[140px]" />
      </div>

      <div className="relative flex min-h-screen">
        <DashboardSidebar
          role={role}
          isCollapsed={isCollapsed}
          onToggle={() =>
            setIsCollapsed((value) => !value)
          }
        />

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border-dark bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="grid size-11 shrink-0 place-items-center rounded-xl border border-border-dark bg-surface text-text-muted transition hover:border-primary/40 hover:text-primary lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu size={21} />
              </button>

              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
            
                </div>

                <h1 className="truncate font-display text-lg font-extrabold text-text-main sm:text-xl">
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative hidden xl:block">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="search"
                  placeholder="Type To Search"
                  className="h-11 w-64 rounded-xl border border-border-dark bg-surface/80 pl-11 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/70 focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                />

              </div>

              <button
                type="button"
                className="relative grid size-11 place-items-center rounded-xl border border-border-dark bg-surface/80 text-text-muted transition hover:border-primary/40 hover:text-primary"
                aria-label="Notifications"
              >
                <Bell size={19} />

                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-surface" />
              </button>

              <div className="hidden sm:grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary-light to-primary-dark font-display text-sm font-extrabold text-background shadow-lg shadow-primary/10">
                {userInitials}
              </div>
            </div>
          </header>

          <motion.main
            key={location.pathname}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="relative p-4 sm:p-6 lg:p-8"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}