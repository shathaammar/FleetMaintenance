using FleetMaintenance.Application.DTOs.Dashboard;

namespace FleetMaintenance.Application.Interfaces.Repositories;

public interface IDashboardRepository
{
    Task<DashboardDto> GetDashboardAsync();
}