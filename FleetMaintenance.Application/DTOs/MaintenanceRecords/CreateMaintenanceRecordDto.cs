namespace FleetMaintenance.Application.DTOs.MaintenanceRecords;

public class CreateMaintenanceRecordDto
{
    public int VehicleId { get; set; }

    public int MaintenanceTypeId { get; set; }

    public DateTime ScheduledDate { get; set; }

    public int? DueMileage { get; set; }

    public string? Notes { get; set; }
}