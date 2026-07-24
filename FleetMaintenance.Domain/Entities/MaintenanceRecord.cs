using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Domain.Entities;

public class MaintenanceRecord
{
    public int Id { get; set; }

    public int VehicleId { get; set; }

    public int MaintenanceTypeId { get; set; }

    public DateTime ScheduledDate { get; set; }

    public DateTime? CompletedDate { get; set; }

    public int? MileageAtService { get; set; }

    public int? DueMileage { get; set; }

    public decimal? Cost { get; set; }

    public string? Notes { get; set; }

    public MaintenanceStatus Status { get; set; }
        = MaintenanceStatus.Scheduled;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Vehicle Vehicle { get; set; } = null!;

    public MaintenanceType MaintenanceType { get; set; } = null!;
}