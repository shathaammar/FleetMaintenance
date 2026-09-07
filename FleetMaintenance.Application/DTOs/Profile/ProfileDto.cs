namespace FleetMaintenance.Application.DTOs.Profile;

public class ProfileDto
{
    public string UserId { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public List<string> Roles { get; set; } = new();

    public DateTime CreatedAt { get; set; }
}