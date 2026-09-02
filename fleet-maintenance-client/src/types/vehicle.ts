export type VehicleStatus =
  | "Active"
  | "InMaintenance"
  | "OutOfService";

export interface Vehicle {
  id: number;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  currentMileage: number;
  status: VehicleStatus;
  createdAt: string;
}

export interface CreateVehicleRequest {
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  currentMileage: number;
}

export interface UpdateVehicleRequest {
  plateNumber?: string;
  make?: string;
  model?: string;
  year?: number;
  currentMileage?: number;
  status?: VehicleStatus;
}

export interface VehicleFilters {
  search?: string;
  status?: VehicleStatus;
  pageNumber: number;
  pageSize: number;
}