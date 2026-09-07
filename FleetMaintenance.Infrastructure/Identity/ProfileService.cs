using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.DTOs.Profile;
using FleetMaintenance.Application.Interfaces.Services;
using Microsoft.AspNetCore.Identity;

namespace FleetMaintenance.Infrastructure.Identity;

public class ProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ICurrentUserService _currentUserService;

    public ProfileService(
        UserManager<ApplicationUser> userManager,
        ICurrentUserService currentUserService)
    {
        _userManager = userManager;
        _currentUserService = currentUserService;
    }

    public async Task<ProfileDto> GetProfileAsync()
    {
        ApplicationUser user = await GetCurrentUserAsync();

        return await MapToDtoAsync(user);
    }

    public async Task<ProfileDto> UpdateProfileAsync(UpdateProfileDto dto)
    {
        ApplicationUser user = await GetCurrentUserAsync();

        if (dto.FullName is not null)
        {
            user.FullName = dto.FullName.Trim();
        }

        if (dto.PhoneNumber is not null)
        {
            user.PhoneNumber =
                string.IsNullOrWhiteSpace(
                    dto.PhoneNumber)
                    ? null
                    : dto.PhoneNumber.Trim();

            user.PhoneNumberConfirmed = false;
        }

        IdentityResult result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            throw new ConflictException(GetIdentityErrors(result));
        }

        return await MapToDtoAsync(user);
    }

    public async Task ChangePasswordAsync(ChangePasswordDto dto)
    {
        ApplicationUser user = await GetCurrentUserAsync();

        IdentityResult result = await _userManager.ChangePasswordAsync(
                user,
                dto.CurrentPassword,
                dto.NewPassword);

        if (!result.Succeeded)
        {
            bool passwordMismatch =
                result.Errors.Any(error => error.Code == "PasswordMismatch");

            if (passwordMismatch)
            {
                throw new BadRequestException(
                    "The current password is incorrect.");
            }

            throw new BadRequestException(GetIdentityErrors(result));
        }
    }

    private async Task<ApplicationUser> GetCurrentUserAsync()
    {
        string userId = _currentUserService.UserId;

        ApplicationUser? user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            throw new UnauthorizedException(
                "The current user could not be identified.");
        }

        return user;
    }

    private async Task<ProfileDto> MapToDtoAsync(ApplicationUser user)
    {
        IList<string> roles = await _userManager.GetRolesAsync(user);

        return new ProfileDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            PhoneNumber = user.PhoneNumber,
            Roles = roles.ToList(),
            CreatedAt = user.CreatedAt
        };
    }

    private static string GetIdentityErrors(IdentityResult result)
    {
        return string.Join(
            " ",
            result.Errors.Select(error =>
                error.Description));
    }
}