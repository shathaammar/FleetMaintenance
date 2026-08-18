using FleetMaintenance.Application.DTOs.Dashboard;

namespace FleetMaintenance.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync();
}