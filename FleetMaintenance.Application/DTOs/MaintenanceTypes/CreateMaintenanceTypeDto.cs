namespace FleetMaintenance.Application.DTOs.MaintenanceTypes
{
    public class CreateMaintenanceTypeDto
    {
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}