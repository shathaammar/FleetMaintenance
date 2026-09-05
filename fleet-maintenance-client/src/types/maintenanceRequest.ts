export type MaintenanceRequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export interface MaintenanceRequest {
  id: number;

  vehicleId: number;
  vehiclePlateNumber: string;

  maintenanceTypeId: number;
  maintenanceTypeName: string;

  requestedByUserId: string;
  requestedByFullName: string;
  requestedByEmail: string;

  description: string;
  preferredDate: string | null;

  status: MaintenanceRequestStatus;

  requestedAt: string;
  reviewedAt: string | null;
  reviewedByUserId: string | null;

  rejectionReason: string | null;
  maintenanceRecordId: number | null;
}

export interface MaintenanceRequestFilters {
  search: string;
  status:
    | MaintenanceRequestStatus
    | "";
  fromDate: string;
  toDate: string;
  pageNumber: number;
  pageSize: number;
}

export interface CreateMaintenanceRequestRequest {
  vehicleId: number;
  maintenanceTypeId: number;
  description: string;
  preferredDate?: string | null;
}

export interface ApproveMaintenanceRequestRequest {
  scheduledDate: string;
  dueMileage?: number | null;
  notes?: string | null;
}

export interface RejectMaintenanceRequestRequest {
  reason: string;
}