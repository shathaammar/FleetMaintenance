export interface UpcomingMaintenance {
  maintenanceRecordId: number;
  vehicleId: number;
  plateNumber: string;
  maintenanceTypeName: string;
  scheduledDate: string;
  dueMileage: number | null;
}

export interface DashboardData {
  totalVehicles: number;
  activeVehicles: number;
  vehiclesInMaintenance: number;
  outOfServiceVehicles: number;
  scheduledMaintenances: number;
  overdueMaintenances: number;
  completedMaintenances: number;
  totalMaintenanceCost: number;
  upcomingMaintenances: UpcomingMaintenance[];
}