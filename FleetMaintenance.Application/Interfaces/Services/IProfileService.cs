using FleetMaintenance.Application.DTOs.Profile;

namespace FleetMaintenance.Application.Interfaces.Services;

public interface IProfileService
{
    Task<ProfileDto> GetProfileAsync();

    Task<ProfileDto> UpdateProfileAsync(UpdateProfileDto dto);

    Task ChangePasswordAsync(ChangePasswordDto dto);
}