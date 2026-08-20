using FluentValidation;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Vehicles;
using FleetMaintenance.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using FleetMaintenance.Application.Common.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace FleetMaintenance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;
    private readonly IValidator<CreateVehicleDto> _createValidator;
    private readonly IValidator<UpdateVehicleDto> _updateValidator;
    private readonly IValidator<VehicleFilterDto> _filterValidator;

    public VehiclesController(
        IVehicleService vehicleService,
        IValidator<CreateVehicleDto> createValidator,
        IValidator<UpdateVehicleDto> updateValidator,
        IValidator<VehicleFilterDto> filterValidator)
    {
        _vehicleService = vehicleService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _filterValidator = filterValidator;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<VehicleDto>>>> GetAll([FromQuery] VehicleFilterDto filter)
    {
        var validationResult = await _filterValidator.ValidateAsync(filter);

        if (!validationResult.IsValid)
        {
            return BadRequest(
                CreateValidationResponse(validationResult));
        }

        var vehicles = await _vehicleService.GetPagedAsync(filter);

        return Ok(new ApiResponse<PagedResult<VehicleDto>>
        {
            Success = true,
            Message = "Vehicles retrieved successfully.",
            Data = vehicles
        });
    }

    [HttpGet("{id:int}")]
    public async Task<
        ActionResult<ApiResponse<VehicleDto>>> GetById(int id)
    {
        var vehicle = await _vehicleService.GetByIdAsync(id);

        return Ok(new ApiResponse<VehicleDto>
        {
            Success = true,
            Message = "Vehicle retrieved successfully.",
            Data = vehicle
        });
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpPost]
    public async Task<
        ActionResult<ApiResponse<VehicleDto>>> Create(
        CreateVehicleDto dto)
    {
        var validationResult =
            await _createValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(
                CreateValidationResponse(validationResult));
        }

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

    [Authorize(Roles = AppRoles.Admin)]
    [HttpPatch("{id:int}")]
    public async Task<
        ActionResult<ApiResponse<VehicleDto>>> Update(
        int id,
        UpdateVehicleDto dto)
    {
        var validationResult =
            await _updateValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(
                CreateValidationResponse(validationResult));
        }

        var vehicle = await _vehicleService.UpdateAsync(id, dto);

        return Ok(new ApiResponse<VehicleDto>
        {
            Success = true,
            Message = "Vehicle updated successfully.",
            Data = vehicle
        });
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpDelete("{id:int}")]
    public async Task<
        ActionResult<ApiResponse<object>>> Delete(int id)
    {
        await _vehicleService.DeleteAsync(id);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Vehicle deleted successfully.",
            Data = null
        });
    }

    private static ApiResponse<object> CreateValidationResponse(
        FluentValidation.Results.ValidationResult validationResult)
    {
        var errors = validationResult.Errors
            .GroupBy(error => error.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Select(error => error.ErrorMessage)
                    .ToArray());

        return new ApiResponse<object>
        {
            Success = false,
            Message = "Validation failed.",
            Data = errors
        };
    }
}