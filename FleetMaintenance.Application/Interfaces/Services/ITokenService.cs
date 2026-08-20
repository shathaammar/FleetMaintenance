using FleetMaintenance.Application.DTOs.Auth;

namespace FleetMaintenance.Application.Interfaces.Services;

public interface ITokenService
{
    TokenResultDto GenerateToken(
        string userId,
        string fullName,
        string email,
        IReadOnlyCollection<string> roles);
}