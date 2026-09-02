import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import type {
  MaintenanceStatus,
} from "../../types/maintenanceRecord";

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus;
  isOverdue?: boolean;
}

export function MaintenanceStatusBadge({
  status,
  isOverdue = false,
}: MaintenanceStatusBadgeProps) {
  if (
    status === "Scheduled" &&
    isOverdue
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/20 bg-danger/10 px-2.5 py-1 text-[11px] font-extrabold text-danger">
        <AlertTriangle size={13} />
        Overdue
      </span>
    );
  }

  const styles: Record<
    MaintenanceStatus,
    string
  > = {
    Scheduled:
      "border-primary/20 bg-primary/10 text-primary",

    Completed:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    Cancelled:
      "border-slate-500/20 bg-slate-500/10 text-slate-400",
  };

  const icons: Record<
    MaintenanceStatus,
    React.ReactNode
  > = {
    Scheduled: <Clock3 size={13} />,
    Completed: (
      <CheckCircle2 size={13} />
    ),
    Cancelled: <Ban size={13} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
}