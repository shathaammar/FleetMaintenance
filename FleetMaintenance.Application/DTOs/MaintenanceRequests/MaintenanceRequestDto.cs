using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Application.DTOs.MaintenanceRequests;

public class MaintenanceRequestDto
{
    public int Id { get; set; }

    public int VehicleId { get; set; }

    public string VehiclePlateNumber { get; set; } = string.Empty;

    public int MaintenanceTypeId { get; set; }

    public string MaintenanceTypeName { get; set; } = string.Empty;

    public string RequestedByUserId { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime? PreferredDate { get; set; }

    public MaintenanceRequestStatus Status { get; set; }

    public DateTime RequestedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public string? ReviewedByUserId { get; set; }

    public string? RejectionReason { get; set; }

    public int? MaintenanceRecordId { get; set; }
}