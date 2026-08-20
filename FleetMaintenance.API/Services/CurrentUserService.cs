using System.Security.Claims;
using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.Interfaces.Services;

namespace FleetMaintenance.API.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(
        IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string UserId =>
        GetRequiredClaim(ClaimTypes.NameIdentifier);

    public string FullName =>
        GetRequiredClaim(ClaimTypes.Name);

    public string Email =>
        GetRequiredClaim(ClaimTypes.Email);

    private string GetRequiredClaim(string claimType)
    {
        string? value =
            _httpContextAccessor
                .HttpContext?
                .User
                .FindFirstValue(claimType);

        if (string.IsNullOrWhiteSpace(value))
        {
            throw new UnauthorizedException(
                "The current user could not be identified.");
        }

        return value;
    }
}