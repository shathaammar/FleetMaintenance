import { motion } from "framer-motion";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Plus,
  RefreshCw,
  RotateCcw,
  XCircle,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { MaintenanceRequestStatusBadge } from "../../components/dashboard/MaintenanceRequestStatusBadge";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

import { dashboardService } from "../../services/dashboardService";

import type {
  RecentMaintenanceRequest,
  UserDashboardData,
} from "../../types/dashboard";

const dateFormatter =
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function formatDate(value: string | null) {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return dateFormatter.format(date);
}

export function UserDashboardPage() {
  const [
    dashboard,
    setDashboard,
  ] = useState<UserDashboardData | null>(
    null,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const loadDashboard =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result =
          await dashboardService
            .getUserDashboard();

        setDashboard(result);
      } catch (error) {
        setDashboard(null);

        setErrorMessage(
          getApiErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (errorMessage || !dashboard) {
    return (
      <DashboardErrorState
        message={
          errorMessage ??
          "Unable to load your dashboard."
        }
        onRetry={() => {
          void loadDashboard();
        }}
      />
    );
  }

  const statistics = [
    {
      label: "Total Requests",
      value: dashboard.totalRequests,
      description: "All submitted requests",
      icon: ClipboardList,
      color:
        "border-blue-500/20 bg-blue-500/10 text-blue-400",
    },
    {
      label: "Pending",
      value: dashboard.pendingRequests,
      description: "Waiting for review",
      icon: Clock3,
      color:
        "border-amber-500/20 bg-amber-500/10 text-amber-400",
    },
    {
      label: "Approved",
      value: dashboard.approvedRequests,
      description: "Accepted by the fleet team",
      icon: CheckCircle2,
      color:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Rejected",
      value: dashboard.rejectedRequests,
      description: "Requests not approved",
      icon: XCircle,
      color:
        "border-red-500/20 bg-red-500/10 text-red-400",
    },
    {
      label: "Cancelled",
      value: dashboard.cancelledRequests,
      description: "Cancelled by you",
      icon: RotateCcw,
      color:
        "border-slate-500/20 bg-slate-500/10 text-slate-400",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-primary/15 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 right-16 size-40 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Your FleetNova Space
            </p>

            <h1 className="mt-2 font-display text-2xl font-black text-text-main sm:text-3xl">
              Keep your maintenance requests
              on track.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-text-muted">
              Submit service requests, follow
              their approval status, and stay
              updated without unnecessary
              calls or paperwork.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/user/maintenance-requests/new"
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-5 text-sm font-extrabold text-background shadow-[0_10px_30px_rgba(245,166,35,0.2)] transition hover:-translate-y-0.5 hover:bg-primary-light sm:w-fit"
            >
              <Plus size={18} />
              New Request
            </Link>

            <Link
              to="/user/maintenance-requests"
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-border-dark bg-background/50 px-5 text-sm font-bold text-text-main transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary sm:w-fit"
            >
              View All Requests
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statistics.map(
          (
            {
              label,
              value,
              description,
              icon: Icon,
              color,
            },
            index,
          ) => (
            <motion.article
              key={label}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.06,
              }}
              className="rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/20"
            >
              <div
                className={`grid size-11 place-items-center rounded-2xl border ${color}`}
              >
                <Icon size={20} />
              </div>

              <p className="mt-5 font-display text-3xl font-black text-text-main">
                {value}
              </p>

              <h2 className="mt-1 text-sm font-extrabold text-text-main">
                {label}
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                {description}
              </p>
            </motion.article>
          ),
        )}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl"
      >
        <div className="flex flex-col gap-3 border-b border-border-dark p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Latest Activity
            </p>

            <h2 className="mt-1 font-display text-xl font-black text-text-main">
              Recent Requests
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Your five most recently
              submitted maintenance requests.
            </p>
          </div>

          {dashboard.recentRequests.length >
            0 && (
            <Link
              to="/user/maintenance-requests"
              className="inline-flex items-center gap-2 self-start text-sm font-bold text-primary transition hover:text-primary-light"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {dashboard.recentRequests.length ===
        0 ? (
          <EmptyRequestsState />
        ) : (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-5">
            {dashboard.recentRequests.map(
              (request, index) => (
                <RecentRequestCard
                  key={request.id}
                  request={request}
                  index={index}
                />
              ),
            )}
          </div>
        )}
      </motion.section>
    </div>
  );
}

interface RecentRequestCardProps {
  request: RecentMaintenanceRequest;
  index: number;
}

function RecentRequestCard({
  request,
  index,
}: RecentRequestCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.24 + index * 0.05,
      }}
      className="flex min-h-64 flex-col rounded-2xl border border-border-dark bg-background/40 p-5 transition hover:-translate-y-1 hover:border-primary/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <ClipboardList size={19} />
        </div>

        <MaintenanceRequestStatusBadge
          status={request.status}
        />
      </div>

      <div className="mt-5 flex-1">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
          Request #{request.id}
        </p>

        <h3 className="mt-2 font-display text-base font-extrabold text-text-main">
          {request.maintenanceTypeName}
        </h3>

        <p className="mt-1 text-xs font-extrabold text-primary">
          {request.vehiclePlateNumber}
        </p>

        <p className="mt-3 line-clamp-2 text-xs leading-5 text-text-muted">
          {request.description}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border-dark pt-4">
        <RequestDate
          label="Preferred"
          value={formatDate(
            request.preferredDate,
          )}
        />

        <RequestDate
          label="Submitted"
          value={formatDate(
            request.requestedAt,
          )}
        />
      </div>

      <Link
        to="/user/maintenance-requests"
        className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 text-xs font-extrabold text-primary transition hover:bg-primary hover:text-background"
      >
        View Request
      </Link>
    </motion.article>
  );
}

interface RequestDateProps {
  label: string;
  value: string;
}

function RequestDate({
  label,
  value,
}: RequestDateProps) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-text-main">
        {value}
      </p>
    </div>
  );
}

function EmptyRequestsState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
      <div className="grid size-16 place-items-center rounded-3xl border border-primary/20 bg-primary/10 text-primary">
        <ClipboardList size={28} />
      </div>

      <h3 className="mt-5 font-display text-lg font-extrabold text-text-main">
        No requests yet
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
        When your vehicle needs attention,
        submit a maintenance request and track
        its progress here.
      </p>

      <Link
        to="/user/maintenance-requests/new"
        className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background transition hover:bg-primary-light"
      >
        <Plus size={18} />
        Create First Request
      </Link>
    </div>
  );
}

function DashboardLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-64 rounded-3xl border border-border-dark bg-surface/70" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-48 rounded-2xl border border-border-dark bg-surface/70"
            />
          ),
        )}
      </div>

      <div className="h-96 rounded-2xl border border-border-dark bg-surface/70" />
    </div>
  );
}

interface DashboardErrorStateProps {
  message: string;
  onRetry: () => void;
}

function DashboardErrorState({
  message,
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/5 px-5 text-center">
      <div className="grid size-16 place-items-center rounded-3xl bg-red-500/10 text-red-400">
        <XCircle size={28} />
      </div>

      <h2 className="mt-5 font-display text-xl font-black text-text-main">
        Dashboard unavailable
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background transition hover:bg-primary-light"
      >
        <RefreshCw size={17} />
        Try Again
      </button>
    </div>
  );
}