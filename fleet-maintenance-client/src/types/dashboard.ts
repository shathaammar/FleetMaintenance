import type { MaintenanceRequestStatus, } from "./maintenanceRequest";

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

export interface RecentMaintenanceRequest {
  id: number;
  vehicleId: number;
  vehiclePlateNumber: string;
  maintenanceTypeId: number;
  maintenanceTypeName: string;
  description: string;
  preferredDate: string | null;
  status: MaintenanceRequestStatus;
  requestedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  maintenanceRecordId: number | null;
}

export interface UserDashboardData {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  cancelledRequests: number;
  recentRequests: RecentMaintenanceRequest[];
}