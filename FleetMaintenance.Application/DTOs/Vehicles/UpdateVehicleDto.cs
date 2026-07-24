using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Application.DTOs.Vehicles
{
    public class UpdateVehicleDto
    {
        public string? PlateNumber { get; set; }

        public string? Make { get; set; }

        public string? Model { get; set; }

        public int? Year { get; set; }

        public int? CurrentMileage { get; set; }

        public VehicleStatus? Status { get; set; }
    }
}
