namespace FleetMaintenance.Application.DTOs.MaintenanceRecords;

public class CompleteMaintenanceRecordDto
{
    public DateTime CompletedDate { get; set; }

    public int MileageAtService { get; set; }

    public decimal Cost { get; set; }

    public string? Notes { get; set; }
}