using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Application.DTOs.MaintenanceRecords;

public class MaintenanceRecordDto
{
    public int Id { get; set; }

    public int VehicleId { get; set; }

    public string VehiclePlateNumber { get; set; } = string.Empty;

    public int MaintenanceTypeId { get; set; }

    public string MaintenanceTypeName { get; set; } = string.Empty;

    public DateTime ScheduledDate { get; set; }

    public DateTime? CompletedDate { get; set; }

    public int? MileageAtService { get; set; }

    public int? DueMileage { get; set; }

    public decimal? Cost { get; set; }

    public string? Notes { get; set; }

    public MaintenanceStatus Status { get; set; }

    public bool IsOverdue { get; set; }

    public DateTime CreatedAt { get; set; }
}