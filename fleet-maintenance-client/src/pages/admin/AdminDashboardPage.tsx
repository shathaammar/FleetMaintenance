import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CarFront,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Gauge,
  RefreshCw,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { StatCard } from "../../components/dashboard/StatCard";
import { ROUTES } from "../../constants/routes";
import { dashboardService } from "../../services/dashboardService";
import type { DashboardData, } from "../../types/dashboard";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-72 rounded-3xl bg-surface" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-48 rounded-2xl bg-surface"
            />
          ),
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-96 rounded-2xl bg-surface" />
        <div className="h-96 rounded-2xl bg-surface" />
      </div>
    </div>
  );
}

interface DashboardErrorProps {
  message: string;
  onRetry: () => void;
}

function DashboardError({
  message,
  onRetry,
}: DashboardErrorProps) {
  return (
    <section className="grid min-h-[65vh] place-items-center">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-danger/10 text-danger">
          <AlertTriangle size={30} />
        </div>

        <h2 className="mt-5 font-display text-2xl font-extrabold text-text-main">
          Dashboard unavailable
        </h2>

        <p className="mt-3 text-sm leading-6 text-text-muted">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mx-auto mt-6 flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-background transition hover:bg-primary-light"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    </section>
  );
}

export function AdminDashboardPage() {
  const [
    dashboard,
    setDashboard,
  ] = useState<DashboardData | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const loadDashboard = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data =
          await dashboardService.getDashboard();

        setDashboard(data);
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (errorMessage) {
    return (
      <DashboardError
        message={errorMessage}
        onRetry={() => {
          void loadDashboard();
        }}
      />
    );
  }

  if (!dashboard) {
    return (
      <DashboardError
        message="Dashboard data could not be loaded."
        onRetry={() => {
          void loadDashboard();
        }}
      />
    );
  }

  const vehicleStatusData = [
    {
      name: "Active",
      value: dashboard.activeVehicles,
      color: "#22c55e",
    },
    {
      name: "In Maintenance",
      value:
        dashboard.vehiclesInMaintenance,
      color: "#f5a623",
    },
    {
      name: "Out of Service",
      value:
        dashboard.outOfServiceVehicles,
      color: "#ef4444",
    },
  ];

  const hasVehicleData =
    vehicleStatusData.some(
      (item) => item.value > 0,
    );

  const operationalItems = [
    {
      label: "Scheduled",
      value:
        dashboard.scheduledMaintenances,
      icon: CalendarClock,
      color:
        "bg-blue-500/10 text-blue-400",
    },
    {
      label: "Completed",
      value:
        dashboard.completedMaintenances,
      icon: CheckCircle2,
      color:
        "bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Overdue",
      value:
        dashboard.overdueMaintenances,
      icon: ShieldAlert,
      color:
        "bg-danger/10 text-danger",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.section
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-surface-light via-surface to-background p-6 shadow-2xl shadow-black/10 lg:p-8"
      >
        <div className="pointer-events-none absolute right-0 top-0 size-72 rounded-full bg-primary/10 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-24 right-8 hidden opacity-10 lg:block">
          <CarFront
            size={290}
            strokeWidth={0.8}
            className="text-primary"
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 text-xs font-bold text-emerald-400">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />

              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>

            Live fleet overview
          </div>

          <h2 className="max-w-xl font-display text-3xl font-extrabold leading-tight text-text-main lg:text-4xl">
            Keep your fleet moving,
            <span className="text-primary">
              {" "}efficiently.
            </span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-text-muted lg:text-base">
            Monitor vehicle availability,
            maintenance schedules and operational
            risks from one intelligent workspace.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={
                ROUTES.ADMIN
                  .MAINTENANCE_REQUESTS
              }
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-background transition hover:bg-primary-light"
            >
              Review Requests
              <ArrowRight size={17} />
            </Link>

            <button
              type="button"
              onClick={() => {
                void loadDashboard();
              }}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-dark bg-surface/70 px-5 text-sm font-bold text-text-main transition hover:border-primary/35 hover:text-primary"
            >
              <RefreshCw size={17} />
              Refresh Data
            </button>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value={dashboard.totalVehicles}
          description="Registered vehicles"
          icon={CarFront}
          accent="orange"
          delay={0.05}
        />

        <StatCard
          title="Active Vehicles"
          value={dashboard.activeVehicles}
          description="Ready for operation"
          icon={Gauge}
          accent="green"
          delay={0.1}
        />

        <StatCard
          title="In Maintenance"
          value={
            dashboard.vehiclesInMaintenance
          }
          description="Currently being serviced"
          icon={Wrench}
          accent="purple"
          delay={0.15}
        />

        <StatCard
          title="Overdue Services"
          value={
            dashboard.overdueMaintenances
          }
          description="Require attention"
          icon={Clock3}
          accent="blue"
          delay={0.2}
        />
      </section>

      <section className="grid items-stretch gap-6 xl:grid-cols-[1fr_1.3fr]">
        <article className="rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-6">
          <div>
            <h3 className="font-display text-lg font-extrabold text-text-main">
              Vehicle Availability
            </h3>

            <p className="mt-1 text-xs text-text-muted">
              Current status of registered vehicles
            </p>
          </div>

          {hasVehicleData ? (
            <>
              <div className="mt-4 flex min-h-[240px] flex-col items-center justify-center gap-5 sm:flex-row sm:gap-7">
  <div className="relative size-[190px] shrink-0 sm:size-[210px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={vehicleStatusData}
          dataKey="value"
          nameKey="name"
          innerRadius="70%"
          outerRadius="92%"
          paddingAngle={5}
          stroke="transparent"
        >
          {vehicleStatusData.map((item) => (
            <Cell
              key={item.name}
              fill={item.color}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            background: "#0a1929",
            border: "1px solid #1e3348",
            borderRadius: "12px",
            color: "#f8fafc",
          }}
        />
      </PieChart>
    </ResponsiveContainer>

    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className="text-center">
        <p className="font-display text-2xl font-extrabold text-text-main sm:text-3xl">
          {dashboard.totalVehicles}
        </p>

        <p className="mt-1 text-[9px] uppercase tracking-wider text-text-muted sm:text-[10px]">
          Vehicles
        </p>
      </div>
    </div>
  </div>

  <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 sm:flex-col sm:items-start sm:gap-5">
    {vehicleStatusData.map((item) => (
      <div
        key={item.name}
        className="flex items-center gap-2.5"
      >
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{
            backgroundColor: item.color,
            boxShadow: `0 0 10px ${item.color}55`,
          }}
        />

        <span className="whitespace-nowrap text-xs font-semibold text-text-muted sm:text-sm">
          {item.name}
        </span>
      </div>
    ))}
  </div>
</div>
            </>
          ) : (
            <div className="grid h-[315px] place-items-center text-center">
              <div>
                <CarFront
                  size={38}
                  className="mx-auto text-text-muted/45"
                />

                <p className="mt-3 text-sm font-bold text-text-main">
                  No vehicles yet
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Vehicle status will appear here.
                </p>
              </div>
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-6">
          <div>
            <h3 className="font-display text-lg font-extrabold text-text-main">
              Maintenance Overview
            </h3>

            <p className="mt-1 text-xs text-text-muted">
              Live maintenance performance
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
  {operationalItems.map((item) => {
    const Icon = item.icon;

    return (
      <div
        key={item.label}
        className="flex min-w-0 items-center gap-3 rounded-xl border border-border-dark bg-background/45 p-3"
      >
        <div
          className={[
            "grid size-10 shrink-0 place-items-center rounded-xl",
            item.color,
          ].join(" ")}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="font-display text-xl font-extrabold leading-none text-text-main">
            {item.value}
          </p>

          <p className="mt-1.5 break-words text-[11px] leading-4 text-text-muted">
            {item.label}
          </p>
        </div>
      </div>
    );
  })}
</div>

          <div className="mt-3 flex items-center justify-between gap-4 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 to-transparent px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Total Maintenance Cost
              </p>

              <p className="mt-2 font-display text-3xl font-extrabold text-text-main">
                {formatCurrency(
                  dashboard.totalMaintenanceCost,
                )}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Recorded completed maintenance
              </p>
            </div>

            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-background">
              <CircleDollarSign size={24} />
            </div>
          </div>

          {dashboard.overdueMaintenances >
            0 && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-danger/20 bg-danger/8 px-4 py-3">
              <ShieldAlert
                size={20}
                className="mt-0.5 shrink-0 text-danger"
              />

              <div>
                <p className="text-sm font-bold text-text-main">
                  Immediate attention required
                </p>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  {dashboard.overdueMaintenances}{" "}
                  maintenance{" "}
                  {dashboard.overdueMaintenances ===
                  1
                    ? "record is"
                    : "records are"}{" "}
                  overdue.
                </p>
              </div>
            </div>
          )}
        </article>
      </section>

      <article className="overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border-dark p-5 sm:px-6">
          <div>
            <h3 className="font-display text-lg font-extrabold text-text-main">
              Upcoming Maintenance
            </h3>

            <p className="mt-1 text-xs text-text-muted">
              Scheduled services requiring follow-up
            </p>
          </div>

          <Link
            to={
              ROUTES.ADMIN
                .MAINTENANCE_RECORDS
            }
            className="flex items-center gap-1 text-xs font-bold text-primary transition hover:text-primary-light"
          >
            View records
            <ArrowRight size={15} />
          </Link>
        </div>

        {dashboard.upcomingMaintenances
          .length === 0 ? (
          <div className="grid min-h-64 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={27} />
              </div>

              <h4 className="mt-4 font-display text-lg font-extrabold text-text-main">
                No upcoming maintenance
              </h4>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
                There are currently no scheduled
                maintenance records requiring
                follow-up.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-border-dark text-[10px] uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-4 font-bold">
                    Record
                  </th>

                  <th className="px-4 py-4 font-bold">
                    Vehicle
                  </th>

                  <th className="px-4 py-4 font-bold">
                    Maintenance Type
                  </th>

                  <th className="px-4 py-4 font-bold">
                    Scheduled Date
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Due Mileage
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboard
                  .upcomingMaintenances
                  .map((maintenance) => (
                    <tr
                      key={
                        maintenance
                          .maintenanceRecordId
                      }
                      className="border-b border-border-dark/70 transition last:border-0 hover:bg-surface-light/45"
                    >
                      <td className="px-6 py-4 text-xs font-bold text-primary">
                        #
                        {
                          maintenance
                            .maintenanceRecordId
                        }
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-xs font-bold text-text-main">
                          {
                            maintenance
                              .plateNumber
                          }
                        </p>

                        <p className="mt-1 text-[11px] text-text-muted">
                          Vehicle #
                          {maintenance.vehicleId}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-xs text-text-main">
                        {
                          maintenance
                            .maintenanceTypeName
                        }
                      </td>

                      <td className="px-4 py-4 text-xs text-text-muted">
                        {formatDate(
                          maintenance
                            .scheduledDate,
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-text-muted">
                        {maintenance.dueMileage !==
                        null
                          ? `${maintenance.dueMileage.toLocaleString()} km`
                          : "Not specified"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}