using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Vehicles;
using FleetMaintenance.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace FleetMaintenance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpGet("vehicles")]
    public async Task<ActionResult<ApiResponse<List<VehicleDto>>>> GetAll()
    {
        var vehicles = await _vehicleService.GetAllAsync();

        return Ok(new ApiResponse<List<VehicleDto>>
        {
            Success = true,
            Message = "Vehicles retrieved successfully.",
            Data = vehicles
        });
    }

    [HttpGet("vehicles/{id:int}")]
    public async Task<ActionResult<ApiResponse<VehicleDto>>> GetById(int id)
    {
        var vehicle = await _vehicleService.GetByIdAsync(id);

        return Ok(new ApiResponse<VehicleDto>
        {
            Success = true,
            Message = "Vehicle retrieved successfully.",
            Data = vehicle
        });
    }

    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<VehicleDto>>> Create(
        CreateVehicleDto dto)
    {
        var vehicle = await _vehicleService.CreateAsync(dto);

        var response = new ApiResponse<VehicleDto>
        {
            Success = true,
            Message = "Vehicle created successfully.",
            Data = vehicle
        };

        return CreatedAtAction(
            nameof(GetById),
            new { id = vehicle.Id },
            response);
    }

    [HttpPatch("update/{id:int}")]
    public async Task<ActionResult<ApiResponse<VehicleDto>>> Update(
        int id,
        UpdateVehicleDto dto)
    {
        var vehicle = await _vehicleService.UpdateAsync(id, dto);

        return Ok(new ApiResponse<VehicleDto>
        {
            Success = true,
            Message = "Vehicle updated successfully.",
            Data = vehicle
        });
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        await _vehicleService.DeleteAsync(id);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Vehicle deleted successfully.",
            Data = null
        });
    }
}