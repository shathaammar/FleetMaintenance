import {
  Ban,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import type {
  LucideIcon,
} from "lucide-react";

import {
  getVehicleStatusLabel,
} from "../../constants/vehicleStatus";
import type {
  VehicleStatus,
} from "../../types/vehicle";

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
}

interface StatusStyle {
  icon: LucideIcon;
  className: string;
}

const statusStyles = {
  Active: {
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  InMaintenance: {
    icon: Wrench,
    className:
      "border-primary/20 bg-primary/10 text-primary",
  },

  OutOfService: {
    icon: Ban,
    className:
      "border-danger/20 bg-danger/10 text-danger",
  },
} satisfies Record<
  VehicleStatus,
  StatusStyle
>;

export function VehicleStatusBadge({
  status,
}: VehicleStatusBadgeProps) {
  const styles =
    statusStyles[status];

  const Icon =
    styles.icon;

  return (
    <span
      className={[
        "inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold leading-none",
        styles.className,
      ].join(" ")}
      title={getVehicleStatusLabel(
        status,
      )}
    >
      <Icon
        size={12}
        strokeWidth={2.5}
        className="shrink-0"
        aria-hidden="true"
      />

      <span className="truncate">
        {getVehicleStatusLabel(
          status,
        )}
      </span>
    </span>
  );
}