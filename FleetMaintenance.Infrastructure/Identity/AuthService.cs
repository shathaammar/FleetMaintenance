using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.DTOs.Auth;
using FleetMaintenance.Application.Interfaces.Services;
using Microsoft.AspNetCore.Identity;

namespace FleetMaintenance.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto> RegisterAsync(
        RegisterDto dto)
    {
        string email = dto.Email.Trim().ToLowerInvariant();

        var existingUser = await _userManager.FindByEmailAsync(email);

        if (existingUser is not null)
        {
            throw new ConflictException(
                "An account with this email already exists.");
        }

        var user = new ApplicationUser
        {
            FullName = dto.FullName.Trim(),
            Email = email,
            UserName = email,
            CreatedAt = DateTime.UtcNow
        };

        IdentityResult result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            string errors = string.Join(
                " ",
                result.Errors.Select(error => error.Description));

            throw new ConflictException(errors);
        }

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        string email = dto.Email.Trim().ToLowerInvariant();

        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
        {
            throw new UnauthorizedException(
                "Invalid email or password.");
        }

        bool passwordIsValid =
            await _userManager.CheckPasswordAsync(
                user,
                dto.Password);

        if (!passwordIsValid)
        {
            throw new UnauthorizedException(
                "Invalid email or password.");
        }

        return CreateAuthResponse(user);
    }

    private AuthResponseDto CreateAuthResponse(
        ApplicationUser user)
    {
        var tokenResult = _tokenService.GenerateToken(
            user.Id,
            user.FullName,
            user.Email!);

        return new AuthResponseDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email!,
            Token = tokenResult.Token,
            ExpiresAt = tokenResult.ExpiresAt
        };
    }
}