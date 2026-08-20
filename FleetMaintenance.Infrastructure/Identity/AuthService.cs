using FleetMaintenance.Application.Common.Authorization;
using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.DTOs.Auth;
using FleetMaintenance.Application.Interfaces.Services;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

namespace FleetMaintenance.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly ApplicationDbContext _dbContext;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService,
        ApplicationDbContext dbContext)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _dbContext = dbContext;
    }

    public async Task<AuthResponseDto> RegisterAsync(
        RegisterDto dto)
    {
        string email =
            dto.Email.Trim().ToLowerInvariant();

        var existingUser =
            await _userManager.FindByEmailAsync(email);

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

        await using var transaction =
            await _dbContext.Database.BeginTransactionAsync();

        try
        {
            IdentityResult createResult =
                await _userManager.CreateAsync(
                    user,
                    dto.Password);

            if (!createResult.Succeeded)
            {
                string errors = string.Join(
                    " ",
                    createResult.Errors.Select(
                        error => error.Description));

                throw new ConflictException(errors);
            }

            IdentityResult roleResult =
                await _userManager.AddToRoleAsync(
                    user,
                    AppRoles.User);

            if (!roleResult.Succeeded)
            {
                string errors = string.Join(
                    " ",
                    roleResult.Errors.Select(
                        error => error.Description));

                throw new ConflictException(errors);
            }

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }

        return await CreateAuthResponseAsync(user);
    }

    public async Task<AuthResponseDto> LoginAsync(
        LoginDto dto)
    {
        string email =
            dto.Email.Trim().ToLowerInvariant();

        var user =
            await _userManager.FindByEmailAsync(email);

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

        return await CreateAuthResponseAsync(user);
    }

    private async Task<AuthResponseDto> CreateAuthResponseAsync(
        ApplicationUser user)
    {
        IList<string> roles =
            await _userManager.GetRolesAsync(user);

        var tokenResult = _tokenService.GenerateToken(
            user.Id,
            user.FullName,
            user.Email!,
            roles.ToArray());

        return new AuthResponseDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email!,
            Roles = roles.ToList(),
            Token = tokenResult.Token,
            ExpiresAt = tokenResult.ExpiresAt
        };
    }
}