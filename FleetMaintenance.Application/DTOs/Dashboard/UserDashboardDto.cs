namespace FleetMaintenance.Application.DTOs.Dashboard;

public class UserDashboardDto
{
    public int TotalRequests { get; set; }

    public int PendingRequests { get; set; }

    public int ApprovedRequests { get; set; }

    public int RejectedRequests { get; set; }

    public int CancelledRequests { get; set; }

    public List<RecentMaintenanceRequestDto> RecentRequests { get; set; } = new();
}