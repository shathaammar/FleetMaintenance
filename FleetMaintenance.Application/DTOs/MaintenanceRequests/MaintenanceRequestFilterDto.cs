using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Application.DTOs.MaintenanceRequests;

public class MaintenanceRequestFilterDto
{
    public string? Search { get; set; }

    public MaintenanceRequestStatus? Status { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public int PageNumber { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}