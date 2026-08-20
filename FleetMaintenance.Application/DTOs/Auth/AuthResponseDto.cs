namespace FleetMaintenance.Application.DTOs.Auth;

public class AuthResponseDto
{
    public string UserId { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Token { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = [];

    public DateTime ExpiresAt { get; set; }
}