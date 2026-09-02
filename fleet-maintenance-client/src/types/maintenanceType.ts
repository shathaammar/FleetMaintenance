export interface MaintenanceType {
  id: number;
  name: string;
  description: string | null;
}

export interface CreateMaintenanceTypeRequest {
  name: string;
  description?: string | null;
}

export interface UpdateMaintenanceTypeRequest {
  name?: string;
  description?: string | null;
}