using FleetMaintenance.Application.Common.Authorization;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRequests;
using FleetMaintenance.Application.Interfaces.Services;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FleetMaintenance.API.Controllers;

[ApiController]
[Route("api/maintenance-requests")]
[Authorize]
public class MaintenanceRequestsController : ControllerBase
{
    private readonly IMaintenanceRequestService _maintenanceRequestService;
    private readonly IValidator<CreateMaintenanceRequestDto> _createValidator;
    private readonly IValidator<ApproveMaintenanceRequestDto> _approveValidator;
    private readonly IValidator<RejectMaintenanceRequestDto> _rejectValidator;

    public MaintenanceRequestsController(
        IMaintenanceRequestService maintenanceRequestService,
        IValidator<CreateMaintenanceRequestDto> createValidator,
        IValidator<ApproveMaintenanceRequestDto> approveValidator,
        IValidator<RejectMaintenanceRequestDto> rejectValidator)
    {
        _maintenanceRequestService = maintenanceRequestService;
        _createValidator = createValidator;
        _approveValidator = approveValidator;
        _rejectValidator = rejectValidator;
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<MaintenanceRequestDto>>>> GetAll()
    {
        var requests = await _maintenanceRequestService.GetAllAsync();

        return Ok(
            new ApiResponse<List<MaintenanceRequestDto>>
            {
                Success = true,
                Message =
                    "Maintenance requests retrieved successfully.",
                Data = requests
            });
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<MaintenanceRequestDto>>> GetById(int id)
    {
        var request = await _maintenanceRequestService.GetByIdAsync(id);

        return Ok(
            new ApiResponse<MaintenanceRequestDto>
            {
                Success = true,
                Message =
                    "Maintenance request retrieved successfully.",
                Data = request
            });
    }

    [Authorize(Roles = AppRoles.User)]
    [HttpGet("my")]
    public async Task<ActionResult<ApiResponse<List<MaintenanceRequestDto>>>> GetMyRequests()
    {
        var requests = await _maintenanceRequestService.GetMyRequestsAsync();

        return Ok(
            new ApiResponse<List<MaintenanceRequestDto>>
            {
                Success = true,
                Message =
                    "Your maintenance requests were retrieved successfully.",
                Data = requests
            });
    }

    [Authorize(Roles = AppRoles.User)]
    [HttpGet("my/{id:int}")]
    public async Task<ActionResult<ApiResponse<MaintenanceRequestDto>>> GetMyRequestById(int id)
    {
        var request = await _maintenanceRequestService.GetMyRequestByIdAsync(id);

        return Ok(
            new ApiResponse<MaintenanceRequestDto>
            {
                Success = true,
                Message =
                    "Maintenance request retrieved successfully.",
                Data = request
            });
    }

    [Authorize(Roles = AppRoles.User)]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<MaintenanceRequestDto>>> Create(CreateMaintenanceRequestDto dto)
    {
        ValidationResult validationResult = await _createValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return CreateValidationResponse(validationResult);
        }

        var request = await _maintenanceRequestService.CreateAsync(dto);

        var response =
            new ApiResponse<MaintenanceRequestDto>
            {
                Success = true,
                Message =
                    "Maintenance request submitted successfully.",
                Data = request
            };

        return CreatedAtAction(
            nameof(GetMyRequestById),
            new { id = request.Id },
            response);
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpPatch("{id:int}/approve")]
    public async Task<ActionResult<ApiResponse<MaintenanceRequestDto>>> Approve(int id, ApproveMaintenanceRequestDto dto)
    {
        ValidationResult validationResult = await _approveValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return CreateValidationResponse(
                validationResult);
        }

        var request = await _maintenanceRequestService.ApproveAsync(id, dto);

        return Ok(
            new ApiResponse<MaintenanceRequestDto>
            {
                Success = true,
                Message =
                    "Maintenance request approved successfully.",
                Data = request
            });
    }

    [Authorize(Roles = AppRoles.Admin)]
    [HttpPatch("{id:int}/reject")]
    public async Task<ActionResult<ApiResponse<MaintenanceRequestDto>>> Reject(int id, RejectMaintenanceRequestDto dto)
    {
        ValidationResult validationResult = await _rejectValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return CreateValidationResponse(validationResult);
        }

        var request = await _maintenanceRequestService.RejectAsync(id, dto);

        return Ok(
            new ApiResponse<MaintenanceRequestDto>
            {
                Success = true,
                Message =
                    "Maintenance request rejected successfully.",
                Data = request
            });
    }

    private BadRequestObjectResult CreateValidationResponse(ValidationResult validationResult)
    {
        var errors = validationResult.Errors
            .GroupBy(error => error.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Select(error => error.ErrorMessage)
                    .ToArray());

        return BadRequest(
            new ApiResponse<object>
            {
                Success = false,
                Message = "Validation failed.",
                Data = errors
            });
    }
}