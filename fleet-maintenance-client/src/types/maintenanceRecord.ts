export type MaintenanceStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled";

export interface MaintenanceRecord {
  id: number;
  vehicleId: number;
  vehiclePlateNumber: string;
  maintenanceTypeId: number;
  maintenanceTypeName: string;
  scheduledDate: string;
  completedDate: string | null;
  mileageAtService: number | null;
  dueMileage: number | null;
  cost: number | null;
  notes: string | null;
  status: MaintenanceStatus;
  isOverdue: boolean;
  createdAt: string;
}

export interface MaintenanceRecordFilters {
  search: string;
  vehicleId: number | null;
  maintenanceTypeId: number | null;
  status: MaintenanceStatus | "";
  fromDate: string;
  toDate: string;
  pageNumber: number;
  pageSize: number;
}

export interface CreateMaintenanceRecordRequest {
  vehicleId: number;
  maintenanceTypeId: number;
  scheduledDate: string;
  dueMileage?: number | null;
  notes?: string | null;
}

export interface UpdateMaintenanceRecordRequest {
  maintenanceTypeId?: number;
  scheduledDate?: string;
  dueMileage?: number;
  notes?: string;
}

export interface CompleteMaintenanceRecordRequest {
  completedDate: string;
  mileageAtService: number;
  cost: number;
  notes?: string | null;
}