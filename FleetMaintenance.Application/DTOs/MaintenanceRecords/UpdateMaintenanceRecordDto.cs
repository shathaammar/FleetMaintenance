namespace FleetMaintenance.Application.DTOs.MaintenanceRecords;

public class UpdateMaintenanceRecordDto
{
    public int? MaintenanceTypeId { get; set; }

    public DateTime? ScheduledDate { get; set; }

    public int? DueMileage { get; set; }

    public string? Notes { get; set; }
}