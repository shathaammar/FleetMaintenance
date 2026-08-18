using FluentValidation;
using FluentValidation.Results;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRecords;
using FleetMaintenance.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace FleetMaintenance.API.Controllers;

[ApiController]
[Route("api/maintenance-records")]
public class MaintenanceRecordsController : ControllerBase
{
    private readonly IMaintenanceRecordService _service;

    private readonly IValidator<CreateMaintenanceRecordDto>
        _createValidator;

    private readonly IValidator<UpdateMaintenanceRecordDto>
        _updateValidator;

    private readonly IValidator<CompleteMaintenanceRecordDto>
        _completeValidator;

    public MaintenanceRecordsController(
        IMaintenanceRecordService service,
        IValidator<CreateMaintenanceRecordDto> createValidator,
        IValidator<UpdateMaintenanceRecordDto> updateValidator,
        IValidator<CompleteMaintenanceRecordDto> completeValidator)
    {
        _service = service;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _completeValidator = completeValidator;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<MaintenanceRecordDto>>>> GetAll()
    {
        var records = await _service.GetAllAsync();

        return Ok(new ApiResponse<List<MaintenanceRecordDto>>
        {
            Success = true,
            Message = "Maintenance records retrieved successfully.",
            Data = records
        });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<MaintenanceRecordDto>>> GetById(int id)
    {
        var record = await _service.GetByIdAsync(id);

        return Ok(new ApiResponse<MaintenanceRecordDto>
        {
            Success = true,
            Message = "Maintenance record retrieved successfully.",
            Data = record
        });
    }

    [HttpGet("vehicle/{vehicleId:int}")]
    public async Task<ActionResult<ApiResponse<List<MaintenanceRecordDto>>>> GetByVehicleId(int vehicleId)
    {
        var records =
            await _service.GetByVehicleIdAsync(vehicleId);

        return Ok(new ApiResponse<List<MaintenanceRecordDto>>
        {
            Success = true,
            Message =
                "Vehicle maintenance records retrieved successfully.",
            Data = records
        });
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<MaintenanceRecordDto>>> Create(CreateMaintenanceRecordDto dto)
    {
        var validationResult =
            await _createValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(
                CreateValidationResponse(validationResult));
        }

        var record = await _service.CreateAsync(dto);

        var response = new ApiResponse<MaintenanceRecordDto>
        {
            Success = true,
            Message = "Maintenance record created successfully.",
            Data = record
        };

        return CreatedAtAction(
            nameof(GetById),
            new { id = record.Id },
            response);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<ApiResponse<MaintenanceRecordDto>>> Update(int id, UpdateMaintenanceRecordDto dto)
    {
        var validationResult =
            await _updateValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(
                CreateValidationResponse(validationResult));
        }

        var record = await _service.UpdateAsync(id, dto);

        return Ok(new ApiResponse<MaintenanceRecordDto>
        {
            Success = true,
            Message = "Maintenance record updated successfully.",
            Data = record
        });
    }

    [HttpPatch("{id:int}/complete")]
    public async Task<ActionResult<ApiResponse<MaintenanceRecordDto>>> Complete(int id, CompleteMaintenanceRecordDto dto)
    {
        var validationResult =
            await _completeValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(
                CreateValidationResponse(validationResult));
        }

        var record = await _service.CompleteAsync(id, dto);

        return Ok(new ApiResponse<MaintenanceRecordDto>
        {
            Success = true,
            Message = "Maintenance record completed successfully.",
            Data = record
        });
    }

    [HttpPatch("{id:int}/cancel")]
    public async Task<ActionResult<ApiResponse<MaintenanceRecordDto>>> Cancel(int id)
    {
        var record = await _service.CancelAsync(id);

        return Ok(new ApiResponse<MaintenanceRecordDto>
        {
            Success = true,
            Message = "Maintenance record cancelled successfully.",
            Data = record
        });
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        await _service.DeleteAsync(id);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Maintenance record deleted successfully.",
            Data = null
        });
    }

    private static ApiResponse<object> CreateValidationResponse(ValidationResult validationResult)
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