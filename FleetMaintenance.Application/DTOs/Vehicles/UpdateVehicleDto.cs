using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Application.DTOs.Vehicles
{
    public class UpdateVehicleDto
    {
        public string PlateNumber { get; set; } = string.Empty;

        public string Make { get; set; } = string.Empty;

        public string Model { get; set; } = string.Empty;

        public int Year { get; set; }

        public int CurrentMileage { get; set; }

        public VehicleStatus Status { get; set; }
    }
}
