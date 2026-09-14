using FleetMaintenance.Application.Common.Authorization;
using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.DTOs.Auth;
using FleetMaintenance.Application.Interfaces.Services;
using FleetMaintenance.Application.Interfaces.UnitOfWork;
using Microsoft.AspNetCore.Identity;

namespace FleetMaintenance.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService,
        IUnitOfWork unitOfWork)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
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

        await _unitOfWork.ExecuteInTransactionAsync(async () =>
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
        });

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

        SignInResult signInResult =
            await _signInManager.CheckPasswordSignInAsync(
                user,
                dto.Password,
                lockoutOnFailure: true);

        if (signInResult.IsLockedOut)
        {
            throw new UnauthorizedException(
                "This account has been temporarily locked due to multiple failed login attempts. Please try again later.");
        }

        if (!signInResult.Succeeded)
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