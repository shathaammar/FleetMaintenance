using System.Security.Claims;
using System.Text;
using FleetMaintenance.Application.Common.Settings;
using FleetMaintenance.Application.DTOs.Auth;
using FleetMaintenance.Application.Interfaces.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace FleetMaintenance.Infrastructure.Identity;

public class TokenService : ITokenService
{
    private readonly JwtSettings _jwtSettings;

    public TokenService(
        IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
    }

    public TokenResultDto GenerateToken(
        string userId,
        string fullName,
        string email)
    {
        if (string.IsNullOrWhiteSpace(_jwtSettings.Key))
        {
            throw new InvalidOperationException(
                "JWT secret key is not configured.");
        }

        DateTime expiresAt = DateTime.UtcNow.AddMinutes(
            _jwtSettings.ExpiryMinutes);

        var claims = new List<Claim>
        {
            new(
                JwtRegisteredClaimNames.Sub,
                userId),

            new(
                ClaimTypes.NameIdentifier,
                userId),

            new(
                JwtRegisteredClaimNames.Email,
                email),

            new(
                ClaimTypes.Email,
                email),

            new(
                ClaimTypes.Name,
                fullName),

            new(
                JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString())
        };

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.Key));

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            IssuedAt = DateTime.UtcNow,
            NotBefore = DateTime.UtcNow,
            Expires = expiresAt,
            SigningCredentials = new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256)
        };

        var tokenHandler = new JsonWebTokenHandler();

        string token = tokenHandler.CreateToken(descriptor);

        return new TokenResultDto
        {
            Token = token,
            ExpiresAt = expiresAt
        };
    }
}