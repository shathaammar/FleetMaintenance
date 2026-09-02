import type { VehicleStatus, } from "../types/vehicle";

interface VehicleStatusOption {
  value: VehicleStatus;
  label: string;
}

export const VEHICLE_STATUS_OPTIONS:
  VehicleStatusOption[] = [
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "InMaintenance",
      label: "In Maintenance",
    },
    {
      value: "OutOfService",
      label: "Out of Service",
    },
  ];

export function getVehicleStatusLabel(
  status: VehicleStatus,
): string {
  return (
    VEHICLE_STATUS_OPTIONS.find(
      (option) =>
        option.value === status,
    )?.label ?? status
  );
}