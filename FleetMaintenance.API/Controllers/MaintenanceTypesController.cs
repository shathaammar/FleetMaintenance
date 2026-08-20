using FleetMaintenance.Application.Common.Authorization;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceTypes;
using FleetMaintenance.Application.Interfaces.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FleetMaintenance.API.Controllers;

[ApiController]
[Route("api/maintenance-types")]
public class MaintenanceTypesController : ControllerBase
{
    private readonly IMaintenanceTypeService _service;
    private readonly IValidator<CreateMaintenanceTypeDto> _createValidator;
    private readonly IValidator<UpdateMaintenanceTypeDto> _updateValidator;

    public MaintenanceTypesController(
        IMaintenanceTypeService service,
        IValidator<CreateMaintenanceTypeDto> createValidator,
        IValidator<UpdateMaintenanceTypeDto> updateValidator)
    {
        _service = service;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    [HttpGet]
    public async Task<
        ActionResult<ApiResponse<List<MaintenanceTypeDto>>>> GetAll()
    {
        var maintenanceTypes = await _service.GetAllAsync();

        return Ok(new ApiResponse<List<MaintenanceTypeDto>>
        {
            Success = true,
            Message = "Maintenance types retrieved successfully.",
            Data = maintenanceTypes.ToList()
        });
    }

    [HttpGet("{id:int}")]
    public async Task<
        ActionResult<ApiResponse<MaintenanceTypeDto>>> GetById(int id)
    {
        var maintenanceType = await _service.GetByIdAsync(id);

        return Ok(new ApiResponse<MaintenanceTypeDto>
        {
            Success = true,
            Message = "Maintenance type retrieved successfully.",
            Data = maintenanceType
        });
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpPost]
    public async Task<
        ActionResult<ApiResponse<MaintenanceTypeDto>>> Create(
        CreateMaintenanceTypeDto dto)
    {
        var validationResult =
            await _createValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(CreateValidationResponse(validationResult));
        }

        var maintenanceType = await _service.CreateAsync(dto);

        var response = new ApiResponse<MaintenanceTypeDto>
        {
            Success = true,
            Message = "Maintenance type created successfully.",
            Data = maintenanceType
        };

        return CreatedAtAction(
            nameof(GetById),
            new { id = maintenanceType.Id },
            response);
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpPatch("{id:int}")]
    public async Task<
        ActionResult<ApiResponse<MaintenanceTypeDto>>> Update(
        int id,
        UpdateMaintenanceTypeDto dto)
    {
        var validationResult =
            await _updateValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(CreateValidationResponse(validationResult));
        }

        var maintenanceType = await _service.UpdateAsync(id, dto);

        return Ok(new ApiResponse<MaintenanceTypeDto>
        {
            Success = true,
            Message = "Maintenance type updated successfully.",
            Data = maintenanceType
        });
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        await _service.DeleteAsync(id);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Maintenance type deleted successfully.",
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