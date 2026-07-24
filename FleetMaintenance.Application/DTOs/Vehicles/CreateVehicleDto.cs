namespace FleetMaintenance.Application.DTOs.Vehicles
{
    public class CreateVehicleDto
    {
        public string PlateNumber { get; set; } = string.Empty;

        public string Make { get; set; } = string.Empty;

        public string Model { get; set; } = string.Empty;

        public int Year { get; set; }

        public int CurrentMileage { get; set; }
    }
}
