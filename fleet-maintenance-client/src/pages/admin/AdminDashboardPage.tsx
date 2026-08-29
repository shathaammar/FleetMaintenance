import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Plus,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { StatCard } from
  "../../components/dashboard/StatCard";
import { ROUTES } from "../../constants/routes";

const maintenanceActivity = [
  { month: "Jan", completed: 18, scheduled: 10 },
  { month: "Feb", completed: 24, scheduled: 14 },
  { month: "Mar", completed: 21, scheduled: 12 },
  { month: "Apr", completed: 32, scheduled: 18 },
  { month: "May", completed: 28, scheduled: 17 },
  { month: "Jun", completed: 38, scheduled: 22 },
  { month: "Jul", completed: 44, scheduled: 26 },
];

const vehicleStatus = [
  {
    name: "Active",
    value: 68,
    color: "#22c55e",
  },
  {
    name: "In Maintenance",
    value: 19,
    color: "#f5a623",
  },
  {
    name: "Out of Service",
    value: 8,
    color: "#ef4444",
  },
  {
    name: "Inactive",
    value: 5,
    color: "#64748b",
  },
];

const recentRequests = [
  {
    id: "REQ-1048",
    vehicle: "Toyota Hilux",
    plate: "ABC-4521",
    requester: "Ahmad Khaled",
    type: "Brake Inspection",
    status: "Pending",
    date: "Aug 28, 2026",
  },
  {
    id: "REQ-1047",
    vehicle: "Ford Transit",
    plate: "JRD-9045",
    requester: "Lina Omar",
    type: "Oil Change",
    status: "Approved",
    date: "Aug 27, 2026",
  },
  {
    id: "REQ-1046",
    vehicle: "Hyundai Tucson",
    plate: "KSA-7312",
    requester: "Sami Nasser",
    type: "Engine Diagnosis",
    status: "Rejected",
    date: "Aug 26, 2026",
  },
  {
    id: "REQ-1045",
    vehicle: "Mercedes Sprinter",
    plate: "AMM-5820",
    requester: "Omar Ali",
    type: "Tire Replacement",
    status: "Approved",
    date: "Aug 25, 2026",
  },
];

function getStatusStyles(status: string) {
  switch (status) {
    case "Approved":
      return "bg-emerald-500/10 text-emerald-400";
    case "Rejected":
      return "bg-danger/10 text-danger";
    default:
      return "bg-primary/10 text-primary";
  }
}

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-bold text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>

            Fleet system is operational
          </div>

          <h2 className="max-w-xl font-display text-3xl font-extrabold leading-tight text-text-main lg:text-4xl">
            Keep your fleet moving,
            <span className="text-primary">
              {" "}efficiently.
            </span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-text-muted lg:text-base">
            Monitor vehicle health, review maintenance
            requests and keep every vehicle ready for
            the road.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={ROUTES.ADMIN.MAINTENANCE_REQUESTS}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-background transition hover:bg-primary-light"
            >
              Review Requests
              <ArrowRight size={17} />
            </Link>

            <Link
              to={ROUTES.ADMIN.VEHICLES}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-dark bg-surface/70 px-5 text-sm font-bold text-text-main transition hover:border-primary/35 hover:text-primary"
            >
              <Plus size={17} />
              Add Vehicle
            </Link>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value={124}
          description="Across the fleet"
          change={8.2}
          icon={CarFront}
          accent="orange"
          delay={0.05}
        />

        <StatCard
          title="Active Vehicles"
          value={98}
          description="Currently available"
          change={5.4}
          icon={CheckCircle2}
          accent="green"
          delay={0.1}
        />

        <StatCard
          title="Pending Requests"
          value={12}
          description="Require attention"
          change={-3.1}
          icon={Clock3}
          accent="blue"
          delay={0.15}
        />

        <StatCard
          title="In Maintenance"
          value={14}
          description="Being serviced"
          change={2.6}
          icon={Wrench}
          accent="purple"
          delay={0.2}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <article className="rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-extrabold text-text-main">
                Maintenance Activity
              </h3>

              <p className="mt-1 text-xs text-text-muted">
                Completed and scheduled maintenance
              </p>
            </div>

            <select className="h-9 rounded-lg border border-border-dark bg-background px-3 text-xs font-semibold text-text-muted outline-none focus:border-primary/50">
              <option>Last 7 months</option>
              <option>Last 12 months</option>
            </select>
          </div>

          <div className="h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={maintenanceActivity}>
                <defs>
                  <linearGradient
                    id="completedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#f5a623"
                      stopOpacity={0.32}
                    />
                    <stop
                      offset="95%"
                      stopColor="#f5a623"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#1e3348"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0a1929",
                    border: "1px solid #1e3348",
                    borderRadius: "12px",
                    color: "#f8fafc",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#f5a623"
                  strokeWidth={3}
                  fill="url(#completedGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="scheduled"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  fill="transparent"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-6">
          <div>
            <h3 className="font-display text-lg font-extrabold text-text-main">
              Vehicle Status
            </h3>

            <p className="mt-1 text-xs text-text-muted">
              Current fleet availability
            </p>
          </div>

          <div className="relative mt-3 h-[205px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={85}
                  paddingAngle={5}
                  stroke="transparent"
                >
                  {vehicleStatus.map((item) => (
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
                <p className="font-display text-3xl font-extrabold text-text-main">
                  124
                </p>
                <p className="text-[10px] uppercase tracking-wider text-text-muted">
                  Vehicles
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {vehicleStatus.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <div className="min-w-0">
                  <p className="truncate text-xs text-text-muted">
                    {item.name}
                  </p>

                  <p className="text-sm font-bold text-text-main">
                    {item.value}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-border-dark p-5 sm:px-6">
            <div>
              <h3 className="font-display text-lg font-extrabold text-text-main">
                Recent Requests
              </h3>

              <p className="mt-1 text-xs text-text-muted">
                Latest maintenance requests
              </p>
            </div>

            <Link
              to={ROUTES.ADMIN.MAINTENANCE_REQUESTS}
              className="flex items-center gap-1 text-xs font-bold text-primary transition hover:text-primary-light"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-border-dark text-[10px] uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-4 font-bold">
                    Request
                  </th>
                  <th className="px-4 py-4 font-bold">
                    Vehicle
                  </th>
                  <th className="px-4 py-4 font-bold">
                    Maintenance
                  </th>
                  <th className="px-4 py-4 font-bold">
                    Status
                  </th>
                  <th className="px-6 py-4 font-bold">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-border-dark/70 transition last:border-0 hover:bg-surface-light/50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-text-main">
                        {request.id}
                      </p>

                      <p className="mt-1 text-[11px] text-text-muted">
                        {request.requester}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-xs font-semibold text-text-main">
                        {request.vehicle}
                      </p>

                      <p className="mt-1 text-[11px] text-text-muted">
                        {request.plate}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-xs text-text-muted">
                      {request.type}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold",
                          getStatusStyles(
                            request.status,
                          ),
                        ].join(" ")}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-text-muted">
                      {request.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-6">
          <h3 className="font-display text-lg font-extrabold text-text-main">
            Attention Required
          </h3>

          <p className="mt-1 text-xs text-text-muted">
            Items that need action
          </p>

          <div className="mt-5 space-y-3">
            {[
              {
                title: "12 pending requests",
                text: "Waiting for admin review",
                icon: ClipboardList,
                color:
                  "bg-primary/10 text-primary",
              },
              {
                title: "6 overdue services",
                text: "Maintenance date has passed",
                icon: ShieldAlert,
                color:
                  "bg-danger/10 text-danger",
              },
              {
                title: "4 vehicles unavailable",
                text: "Currently out of service",
                icon: CarFront,
                color:
                  "bg-blue-500/10 text-blue-400",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group flex items-center gap-3 rounded-xl border border-border-dark bg-background/50 p-3 transition hover:border-primary/25"
                >
                  <div
                    className={[
                      "grid size-10 shrink-0 place-items-center rounded-xl",
                      item.color,
                    ].join(" ")}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-text-main">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[11px] text-text-muted">
                      {item.text}
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-text-muted transition group-hover:translate-x-1 group-hover:text-primary"
                  />
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
}