using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Application.DTOs.Vehicles;

public class VehicleFilterDto
{
    public string? Search { get; set; }

    public VehicleStatus? Status { get; set; }

    public int PageNumber { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}