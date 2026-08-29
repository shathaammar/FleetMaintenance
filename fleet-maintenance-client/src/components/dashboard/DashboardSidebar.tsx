import type { LucideIcon } from "lucide-react";
import {
  CarFront,
  ChevronLeft,
  ClipboardList,
  Gauge,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

import { ROUTES } from "../../constants/routes";

import FleetNoveLogo from "../../assets/FleetNove-Logo.png";

import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

type UserRole = "Admin" | "User";

interface DashboardSidebarProps {
  role: UserRole;
  isCollapsed: boolean;
  onToggle: () => void;
}

interface SidebarItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const adminItems: SidebarItem[] = [
  {
    label: "Dashboard",
    path: ROUTES.ADMIN.DASHBOARD,
    icon: Gauge,
  },
  {
    label: "Vehicles",
    path: ROUTES.ADMIN.VEHICLES,
    icon: CarFront,
  },
  {
    label: "Maintenance Types",
    path: ROUTES.ADMIN.MAINTENANCE_TYPES,
    icon: Wrench,
  },
  {
    label: "Maintenance Records",
    path: ROUTES.ADMIN.MAINTENANCE_RECORDS,
    icon: ClipboardList,
  },
  {
    label: "Maintenance Requests",
    path: ROUTES.ADMIN.MAINTENANCE_REQUESTS,
    icon: ShieldCheck,
  },
];

const userItems: SidebarItem[] = [
  {
    label: "Dashboard",
    path: ROUTES.USER.DASHBOARD,
    icon: Gauge,
  },
  {
    label: "Vehicles",
    path: ROUTES.USER.VEHICLES,
    icon: CarFront,
  },
  {
    label: "New Request",
    path: ROUTES.USER.NEW_REQUEST,
    icon: Wrench,
  },
  {
    label: "My Requests",
    path: ROUTES.USER.MY_REQUESTS,
    icon: ClipboardList,
  },
];

export function DashboardSidebar({
  role,
  isCollapsed,
  onToggle,
}: DashboardSidebarProps) {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();

    toast.success(
      "You have been logged out successfully.",
    );

    navigate(
      ROUTES.LOGIN,
      {
        replace: true,
      },
    );
  };

  const items =
    role === "Admin" ? adminItems : userItems;

  const settingsPath =
    role === "Admin"
      ? ROUTES.ADMIN.SETTINGS
      : ROUTES.USER.SETTINGS;

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 88 : 280,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="sticky top-0 hidden h-screen shrink-0 border-r border-border-dark bg-surface/95 backdrop-blur-xl lg:flex lg:flex-col"
    >
      <div className="flex h-20 items-center justify-between border-b border-border-dark px-5">
        <NavLink
          to={
            role === "Admin"
              ? ROUTES.ADMIN.DASHBOARD
              : ROUTES.USER.DASHBOARD
          }
          className="flex min-w-0 items-center gap-3"
        >
          <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-primary/20 bg-surface-light shadow-[0_8px_30px_rgba(245,166,35,0.18)]">
            <img
              src={FleetNoveLogo}
              alt="FleetNova logo"
              className="size-full object-contain p-1.5"
            />
          </div>

{!isCollapsed && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-w-0 flex-1"
  >
    <p className="whitespace-nowrap font-display text-lg font-extrabold tracking-tight text-text-main">
      Fleet
      <span className="text-primary">
        Nova
      </span>
    </p>

    <p className="whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.13em] text-text-muted">
      Smart Fleet Management
    </p>
  </motion.div>
)}
        </NavLink>

        {!isCollapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="grid size-9 place-items-center rounded-xl text-text-muted transition hover:bg-surface-light hover:text-primary"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={19} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button
          type="button"
          onClick={onToggle}
          className="mx-auto mt-5 grid size-10 place-items-center rounded-xl text-text-muted transition hover:bg-surface-light hover:text-primary"
          aria-label="Expand sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  "group relative flex h-12 items-center rounded-xl transition-all duration-200",
                  isCollapsed
                    ? "justify-center px-0"
                    : "gap-3 px-3",
                  isActive
                    ? "bg-gradient-to-r from-[#f9b75f]/90 via-[#f59e0b] to-[#f97316] text-background shadow-[0_12px_30px_rgba(249,115,22,0.28)] ring-1 ring-orange-200/40 backdrop-blur-sm"
                    : "text-text-muted hover:bg-surface-light hover:text-text-main",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.4 : 1.9}
                    className="shrink-0"
                  />

                  {!isCollapsed && (
                    <span className="truncate text-sm font-semibold">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border-dark p-4">
        <NavLink
          to={settingsPath}
          title={isCollapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            [
              "mb-3 flex h-11 items-center rounded-xl text-text-muted transition hover:bg-surface-light hover:text-text-main",
              isCollapsed
                ? "justify-center"
                : "gap-3 px-3",
              isActive
                ? "bg-gradient-to-r from-[#f9b75f]/90 via-[#f59e0b] to-[#f97316] text-black shadow-[0_12px_30px_rgba(249,115,22,0.28)] ring-1 ring-orange-200/40 backdrop-blur-sm"
                : "",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <Settings
                size={19}
                className={isActive ? "text-white" : "text-current"}
              />

              {!isCollapsed && (
                <span className={isActive ? "text-white font-semibold" : "font-semibold"}>
                  Settings
                </span>
              )}
            </>
          )}
        </NavLink>

        <div
          className={[
            "flex items-center rounded-2xl border border-border-dark bg-background/60",
            isCollapsed
              ? "justify-center p-2"
              : "gap-3 p-3",
          ].join(" ")}
        >
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-light text-primary">
            <UserRound size={20} />
          </div>

          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-text-main">
                  {user?.fullName ?? "FleetNova User"}
                </p>

                <p className="truncate text-xs text-text-muted">
                  {user?.email ?? role}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="grid size-9 place-items-center rounded-xl text-text-muted transition hover:bg-danger/10 hover:text-danger"
                aria-label="Log out"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
}