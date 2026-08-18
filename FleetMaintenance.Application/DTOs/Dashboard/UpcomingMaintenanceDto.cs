namespace FleetMaintenance.Application.DTOs.Dashboard;

public class UpcomingMaintenanceDto
{
    public int MaintenanceRecordId { get; set; }

    public int VehicleId { get; set; }

    public string PlateNumber { get; set; } = string.Empty;

    public string MaintenanceTypeName { get; set; } = string.Empty;

    public DateTime ScheduledDate { get; set; }

    public int? DueMileage { get; set; }
}