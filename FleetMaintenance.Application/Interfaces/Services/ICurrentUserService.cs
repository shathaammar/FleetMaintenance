namespace FleetMaintenance.Application.Interfaces.Services;

public interface ICurrentUserService
{
    string UserId { get; }

    string FullName { get; }

    string Email { get; }
}