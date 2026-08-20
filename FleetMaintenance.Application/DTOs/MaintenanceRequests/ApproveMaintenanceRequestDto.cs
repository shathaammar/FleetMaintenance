namespace FleetMaintenance.Application.DTOs.MaintenanceRequests;

public class ApproveMaintenanceRequestDto
{
    public DateTime ScheduledDate { get; set; }

    public int? DueMileage { get; set; }

    public string? Notes { get; set; }
}