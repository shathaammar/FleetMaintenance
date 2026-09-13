using FleetMaintenance.Application.Common.Authorization;
using FleetMaintenance.Application.Common.Extensions;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Users;
using FleetMaintenance.Application.Interfaces.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FleetMaintenance.API.Controllers;

[Authorize(Roles = AppRoles.Admin)]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IValidator<UserFilterDto> _filterValidator;
    private readonly IValidator<UpdateUserRoleDto> _updateRoleValidator;

    public UsersController(
        IUserService userService,
        IValidator<UserFilterDto> filterValidator,
        IValidator<UpdateUserRoleDto> updateRoleValidator)
    {
        _userService = userService;
        _filterValidator = filterValidator;
        _updateRoleValidator = updateRoleValidator;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<UserSummaryDto>>>> GetAll([FromQuery] UserFilterDto filter)
    {
        var validationResult = await _filterValidator.ValidateAsync(filter);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.ToApiResponse());
        }

        var users = await _userService.GetPagedAsync(filter);

        return Ok(new ApiResponse<PagedResult<UserSummaryDto>>
        {
            Success = true,
            Message = "Users retrieved successfully.",
            Data = users
        });
    }

    [HttpPatch("{id}/role")]
    public async Task<ActionResult<ApiResponse<UserSummaryDto>>> UpdateRole(string id, UpdateUserRoleDto dto)
    {
        var validationResult = await _updateRoleValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.ToApiResponse());
        }

        var user = await _userService.UpdateRoleAsync(id, dto);

        return Ok(new ApiResponse<UserSummaryDto>
        {
            Success = true,
            Message = "User role updated successfully.",
            Data = user
        });
    }
}