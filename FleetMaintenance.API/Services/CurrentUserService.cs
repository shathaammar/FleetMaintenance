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

    public string UserId
    {
        get
        {
            string? userId =
                _httpContextAccessor
                    .HttpContext?
                    .User
                    .FindFirstValue(
                        ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new UnauthorizedException(
                    "The current user could not be identified.");
            }

            return userId;
        }
    }
}