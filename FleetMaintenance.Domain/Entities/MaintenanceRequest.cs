using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Domain.Entities;

public class MaintenanceRequest
{
    public int Id { get; set; }

    public int VehicleId { get; set; }

    public int MaintenanceTypeId { get; set; }

    public string RequestedByUserId { get; set; } = string.Empty;

    public string RequestedByFullName { get; set; } = string.Empty;

    public string RequestedByEmail { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime? PreferredDate { get; set; }

    public MaintenanceRequestStatus Status { get; set; } =
        MaintenanceRequestStatus.Pending;

    public DateTime RequestedAt { get; set; } =
        DateTime.UtcNow;

    public DateTime? ReviewedAt { get; set; }

    public string? ReviewedByUserId { get; set; }

    public string? RejectionReason { get; set; }

    public int? MaintenanceRecordId { get; set; }

    public Vehicle Vehicle { get; set; } = null!;

    public MaintenanceType MaintenanceType { get; set; } = null!;

    public MaintenanceRecord? MaintenanceRecord { get; set; }
}