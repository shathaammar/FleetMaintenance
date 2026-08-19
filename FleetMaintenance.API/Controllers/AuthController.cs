using FluentValidation;
using FluentValidation.Results;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Auth;
using FleetMaintenance.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FleetMaintenance.API.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IValidator<RegisterDto> _registerValidator;
    private readonly IValidator<LoginDto> _loginValidator;

    public AuthController(
        IAuthService authService,
        IValidator<RegisterDto> registerValidator,
        IValidator<LoginDto> loginValidator)
    {
        _authService = authService;
        _registerValidator = registerValidator;
        _loginValidator = loginValidator;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>>
        Register(RegisterDto dto)
    {
        var validationResult =
            await _registerValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(
                CreateValidationResponse(validationResult));
        }

        var result = await _authService.RegisterAsync(dto);

        return StatusCode(
            StatusCodes.Status201Created,
            new ApiResponse<AuthResponseDto>
            {
                Success = true,
                Message = "Account created successfully.",
                Data = result
            });
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>>
        Login(LoginDto dto)
    {
        var validationResult =
            await _loginValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(
                CreateValidationResponse(validationResult));
        }

        var result = await _authService.LoginAsync(dto);

        return Ok(new ApiResponse<AuthResponseDto>
        {
            Success = true,
            Message = "Login successful.",
            Data = result
        });
    }

    private static ApiResponse<object> CreateValidationResponse(
        ValidationResult validationResult)
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