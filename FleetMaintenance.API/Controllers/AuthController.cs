using FluentValidation;
using FleetMaintenance.Application.Common.Extensions;
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
                validationResult.ToApiResponse());
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
                validationResult.ToApiResponse());
        }

        var result = await _authService.LoginAsync(dto);

        return Ok(new ApiResponse<AuthResponseDto>
        {
            Success = true,
            Message = "Login successful.",
            Data = result
        });
    }
}