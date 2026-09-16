import {
  Ban,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

import type {
  MaintenanceRequestStatus,
} from "../../types/maintenanceRequest";

interface MaintenanceRequestStatusBadgeProps {
  status: MaintenanceRequestStatus;
}

export function MaintenanceRequestStatusBadge({
  status,
}: MaintenanceRequestStatusBadgeProps) {
  const styles: Record<
    MaintenanceRequestStatus,
    string
  > = {
    Pending:
      "border-primary/20 bg-primary/10 text-primary",

    Approved:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    Rejected:
      "border-danger/20 bg-danger/10 text-danger",

    Cancelled:
      "border-slate-500/20 bg-slate-500/10 text-slate-400",
  };

  const icons: Record<
    MaintenanceRequestStatus,
    ReactNode
  > = {
    Pending: <Clock3 size={13} />,

    Approved: (
      <CheckCircle2 size={13} />
    ),

    Rejected: <XCircle size={13} />,

    Cancelled: <Ban size={13} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
}