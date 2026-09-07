using FleetMaintenance.Application.DTOs.Dashboard;
using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Application.Interfaces.Services;

namespace FleetMaintenance.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _dashboardRepository;
    private readonly ICurrentUserService _currentUserService;

    public DashboardService(
        IDashboardRepository dashboardRepository,
        ICurrentUserService currentUserService)
    {
        _dashboardRepository = dashboardRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DashboardDto> GetDashboardAsync()
    {
        return await _dashboardRepository.GetDashboardAsync();
    }

    public async Task<UserDashboardDto> GetUserDashboardAsync()
    {
        string userId = _currentUserService.UserId;

        return await _dashboardRepository.GetUserDashboardAsync(userId);
    }
}