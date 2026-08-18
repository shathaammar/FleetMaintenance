namespace FleetMaintenance.Application.DTOs.Dashboard;

public class DashboardDto
{
    public int TotalVehicles { get; set; }

    public int ActiveVehicles { get; set; }

    public int VehiclesInMaintenance { get; set; }

    public int OutOfServiceVehicles { get; set; }

    public int ScheduledMaintenances { get; set; }

    public int OverdueMaintenances { get; set; }

    public int CompletedMaintenances { get; set; }

    public decimal TotalMaintenanceCost { get; set; }

    public List<UpcomingMaintenanceDto> UpcomingMaintenances { get; set; } = new();
}