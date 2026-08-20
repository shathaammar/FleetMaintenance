using FleetMaintenance.Application.Common.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FleetMaintenance.Infrastructure.Identity;

public static class IdentitySeeder
{
    public static async Task SeedAsync(
        IServiceProvider serviceProvider,
        IConfiguration configuration)
    {
        using var scope = serviceProvider.CreateScope();

        var roleManager =
            scope.ServiceProvider
                .GetRequiredService<RoleManager<IdentityRole>>();

        var userManager =
            scope.ServiceProvider
                .GetRequiredService<UserManager<ApplicationUser>>();

        await SeedRolesAsync(roleManager);

        await SeedAdminAsync(
            userManager,
            configuration);
    }

    private static async Task SeedRolesAsync(
        RoleManager<IdentityRole> roleManager)
    {
        string[] roles =
        [
            AppRoles.Admin,
            AppRoles.User
        ];

        foreach (string role in roles)
        {
            if (await roleManager.RoleExistsAsync(role))
            {
                continue;
            }

            IdentityResult result =
                await roleManager.CreateAsync(
                    new IdentityRole(role));

            ThrowIfFailed(
                result,
                $"Could not create role '{role}'.");
        }
    }

    private static async Task SeedAdminAsync(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        string? email =
            configuration["AdminSeed:Email"];

        string? password =
            configuration["AdminSeed:Password"];

        string? fullName =
            configuration["AdminSeed:FullName"];

        if (string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(fullName))
        {
            return;
        }

        email = email.Trim().ToLowerInvariant();

        ApplicationUser? admin =
            await userManager.FindByEmailAsync(email);

        if (admin is null)
        {
            admin = new ApplicationUser
            {
                FullName = fullName.Trim(),
                Email = email,
                UserName = email,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            IdentityResult createResult =
                await userManager.CreateAsync(
                    admin,
                    password);

            ThrowIfFailed(
                createResult,
                "Could not create the admin account.");
        }

        bool isAdmin =
            await userManager.IsInRoleAsync(
                admin,
                AppRoles.Admin);

        if (!isAdmin)
        {
            IdentityResult roleResult =
                await userManager.AddToRoleAsync(
                    admin,
                    AppRoles.Admin);

            ThrowIfFailed(
                roleResult,
                "Could not assign the Admin role.");
        }
    }

    private static void ThrowIfFailed(
        IdentityResult result,
        string message)
    {
        if (result.Succeeded)
        {
            return;
        }

        string errors = string.Join(
            " ",
            result.Errors.Select(
                error => error.Description));

        throw new InvalidOperationException(
            $"{message} {errors}");
    }
}