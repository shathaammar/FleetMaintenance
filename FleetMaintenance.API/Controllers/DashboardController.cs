using FleetMaintenance.Application.Common.Authorization;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Dashboard;
using FleetMaintenance.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FleetMaintenance.API.Controllers;

[Authorize]
[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController( IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpGet]
    public async Task<ActionResult<ApiResponse<DashboardDto>>> Get()
    {
        var dashboard = await _dashboardService.GetDashboardAsync();

        return Ok(new ApiResponse<DashboardDto>
        {
            Success = true,
            Message = "Dashboard retrieved successfully.",
            Data = dashboard
        });
    }

    [Authorize(Roles = AppRoles.User)]
    [HttpGet("my")]
    public async Task<ActionResult<ApiResponse<UserDashboardDto>>> GetUserDashboard()
    {
        var dashboard = await _dashboardService.GetUserDashboardAsync();

        return Ok(
            new ApiResponse<UserDashboardDto>
            {
                Success = true,
                Message = "User dashboard retrieved successfully.",
                Data = dashboard
            });
    }
}