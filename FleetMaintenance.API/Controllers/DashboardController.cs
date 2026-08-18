using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Dashboard;
using FleetMaintenance.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace FleetMaintenance.API.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(
        IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<DashboardDto>>> Get()
    {
        var dashboard =
            await _dashboardService.GetDashboardAsync();

        return Ok(new ApiResponse<DashboardDto>
        {
            Success = true,
            Message = "Dashboard retrieved successfully.",
            Data = dashboard
        });
    }
}