namespace FleetMaintenance.Application.DTOs.MaintenanceRequests;

public class CreateMaintenanceRequestDto
{
    public int VehicleId { get; set; }

    public int MaintenanceTypeId { get; set; }

    public string Description { get; set; } = string.Empty;

    public DateTime? PreferredDate { get; set; }
}