namespace FleetMaintenance.Application.DTOs.MaintenanceTypes
{
    public class MaintenanceTypeDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}