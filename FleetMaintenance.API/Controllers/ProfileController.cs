using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Profile;
using FleetMaintenance.Application.Interfaces.Services;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FleetMaintenance.API.Controllers;

[Authorize]
[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;
    private readonly IValidator<UpdateProfileDto> _updateValidator;
    private readonly IValidator<ChangePasswordDto> _passwordValidator;

    public ProfileController(
        IProfileService profileService,
        IValidator<UpdateProfileDto> updateValidator,
        IValidator<ChangePasswordDto> passwordValidator)
    {
        _profileService = profileService;
        _updateValidator = updateValidator;
        _passwordValidator = passwordValidator;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<ProfileDto>>> GetProfile()
    {
        ProfileDto profile = await _profileService.GetProfileAsync();

        return Ok(
            new ApiResponse<ProfileDto>
            {
                Success = true,
                Message = "Profile retrieved successfully.",
                Data = profile
            });
    }

    [HttpPatch]
    public async Task<ActionResult<ApiResponse<ProfileDto>>> UpdateProfile(UpdateProfileDto dto)
    {
        ValidationResult validationResult = await _updateValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return CreateValidationResponse(validationResult);
        }

        ProfileDto profile = await _profileService.UpdateProfileAsync(dto);

        return Ok(
            new ApiResponse<ProfileDto>
            {
                Success = true,
                Message = "Profile updated successfully.",
                Data = profile
            });
    }

    [HttpPatch("password")]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword(ChangePasswordDto dto)
    {
        ValidationResult validationResult = await _passwordValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return CreateValidationResponse(validationResult);
        }

        await _profileService.ChangePasswordAsync(dto);

        return Ok(
            new ApiResponse<object>
            {
                Success = true,
                Message = "Password changed successfully.",
                Data = null
            });
    }

    private BadRequestObjectResult CreateValidationResponse(ValidationResult validationResult)
    {
        var errors = validationResult.Errors
                .GroupBy(error =>
                    error.PropertyName)
                .ToDictionary(
                    group => group.Key,
                    group => group
                        .Select(error =>
                            error.ErrorMessage)
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