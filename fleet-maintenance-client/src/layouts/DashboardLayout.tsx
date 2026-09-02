import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Bell,
  Menu,
  Search,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  DashboardSidebar,
} from "../components/dashboard/DashboardSidebar";
import {
  useAuth,
} from "../hooks/useAuth";

type UserRole = "Admin" | "User";

interface DashboardLayoutProps {
  role: UserRole;
}

const pageTitles: Record<
  string,
  string
> = {
  "/admin/dashboard":
    "Dashboard Overview",

  "/admin/vehicles":
    "Vehicle Management",

  "/admin/maintenance-types":
    "Maintenance Types",

  "/admin/maintenance-records":
    "Maintenance Records",

  "/admin/maintenance-requests":
    "Maintenance Requests",

  "/admin/settings":
    "Settings",

  "/user/dashboard":
    "My Dashboard",

  "/user/vehicles":
    "Available Vehicles",

  "/user/maintenance-requests/new":
    "New Maintenance Request",

  "/user/maintenance-requests":
    "My Maintenance Requests",

  "/user/settings":
    "Settings",
};

export function DashboardLayout({
  role,
}: DashboardLayoutProps) {
  const location =
    useLocation();

  const {
    user,
  } = useAuth();

  const [
    isCollapsed,
    setIsCollapsed,
  ] = useState(false);

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  const pageTitle = useMemo(() => {
    return (
      pageTitles[location.pathname] ??
      "Fleet Maintenance"
    );
  }, [
    location.pathname,
  ]);

  const userInitials = useMemo(() => {
    const initials = user?.fullName
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();

    if (initials) {
      return initials;
    }

    return role === "Admin"
      ? "FA"
      : "FU";
  }, [
    user?.fullName,
    role,
  ]);

  // Close the mobile sidebar after navigating.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [
    location.pathname,
  ]);

  // Close with Escape and prevent background scrolling.
  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isMobileMenuOpen,
  ]);

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-dvh bg-background text-text-main">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 size-[420px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="absolute bottom-0 left-1/3 size-[360px] rounded-full bg-blue-500/5 blur-[140px]" />
      </div>

      <div className="relative flex min-h-dvh">
        {/* Desktop sidebar */}
        <DashboardSidebar
          role={role}
          isCollapsed={isCollapsed}
          onToggle={() => {
            setIsCollapsed(
              (currentValue) =>
                !currentValue,
            );
          }}
        />

        {/* Mobile sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.button
                type="button"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                onClick={closeMobileMenu}
                className="absolute inset-0 size-full cursor-default bg-background/80 backdrop-blur-sm"
                aria-label="Close navigation menu"
              />

              <motion.div
                initial={{
                  x: -300,
                }}
                animate={{
                  x: 0,
                }}
                exit={{
                  x: -300,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="relative h-dvh w-[280px] max-w-[85vw] overflow-hidden shadow-2xl shadow-black/50 [&>aside]:!relative [&>aside]:!flex [&>aside]:!h-dvh [&>aside]:!w-full [&>aside]:!flex-col"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
              >
                <DashboardSidebar
                  role={role}
                  isCollapsed={false}
                  onToggle={
                    closeMobileMenu
                  }
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-border-dark bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            {/* Mobile menu and title */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={openMobileMenu}
                className="grid size-11 shrink-0 place-items-center rounded-xl border border-border-dark bg-surface text-text-muted transition hover:border-primary/40 hover:text-primary lg:hidden"
                aria-label="Open navigation menu"
                aria-expanded={
                  isMobileMenuOpen
                }
              >
                <Menu size={21} />
              </button>

              <h1 className="min-w-0 truncate font-display text-base font-extrabold text-text-main sm:text-xl">
                {pageTitle}
              </h1>
            </div>

            {/* Header actions */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="relative hidden xl:block">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="search"
                  placeholder="Type To Search"
                  aria-label="Search"
                  className="h-11 w-56 rounded-xl border border-border-dark bg-surface/80 pl-11 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/70 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 2xl:w-64"
                />
              </div>

              <button
                type="button"
                className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-border-dark bg-surface/80 text-text-muted transition hover:border-primary/40 hover:text-primary"
                aria-label="Notifications"
              >
                <Bell size={19} />

                <span
                  className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-surface"
                  aria-hidden="true"
                />
              </button>

              <div
                className="hidden size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-light to-primary-dark font-display text-sm font-extrabold text-background shadow-lg shadow-primary/10 sm:grid"
                title={
                  user?.fullName ??
                  "FleetNova User"
                }
                aria-label={
                  user?.fullName ??
                  "FleetNova User"
                }
              >
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
            className="relative min-w-0 p-4 sm:p-6 lg:p-8"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}