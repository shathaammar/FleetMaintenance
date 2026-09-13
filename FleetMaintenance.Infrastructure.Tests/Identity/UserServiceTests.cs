using FleetMaintenance.Application.Common.Authorization;
using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.DTOs.Users;
using FleetMaintenance.Application.Interfaces.Services;
using FleetMaintenance.Infrastructure.Identity;
using FleetMaintenance.Infrastructure.Tests.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace FleetMaintenance.Infrastructure.Tests.Identity;

public class UserServiceTests
{
    [Fact]
    public async Task UpdateRoleAsync_WhenChangingAnotherUserFromUserToAdmin_ResultsInExactlyAdmin()
    {
        // Arrange
        using var fixture = new SqliteTestDbContextFactory();

        var userManager = fixture.Services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = fixture.Services.GetRequiredService<RoleManager<IdentityRole>>();

        await roleManager.CreateAsync(new IdentityRole(AppRoles.Admin));
        await roleManager.CreateAsync(new IdentityRole(AppRoles.User));

        var admin = await CreateUserAsync(userManager, "admin@fleetnova.test", "Admin One");
        await userManager.AddToRoleAsync(admin, AppRoles.Admin);

        var targetUser = await CreateUserAsync(userManager, "target@fleetnova.test", "Target User");
        await userManager.AddToRoleAsync(targetUser, AppRoles.User);

        var currentUserServiceMock = new Mock<ICurrentUserService>();
        currentUserServiceMock.Setup(x => x.UserId).Returns(admin.Id);

        var service = new UserService(userManager, fixture.Context, currentUserServiceMock.Object);

        // Act
        var result = await service.UpdateRoleAsync(
            targetUser.Id,
            new UpdateUserRoleDto { Role = AppRoles.Admin });

        // Assert
        Assert.Equal(new[] { AppRoles.Admin }, result.Roles);

        var rolesAfter = await userManager.GetRolesAsync(targetUser);
        Assert.Single(rolesAfter);
        Assert.Equal(AppRoles.Admin, rolesAfter[0]);
    }

    [Fact]
    public async Task UpdateRoleAsync_WhenUserHasBothRoles_NormalizesToExactlyRequestedRole()
    {
        // Arrange
        using var fixture = new SqliteTestDbContextFactory();

        var userManager = fixture.Services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = fixture.Services.GetRequiredService<RoleManager<IdentityRole>>();

        await roleManager.CreateAsync(new IdentityRole(AppRoles.Admin));
        await roleManager.CreateAsync(new IdentityRole(AppRoles.User));

        var admin = await CreateUserAsync(userManager, "admin2@fleetnova.test", "Admin Two");
        await userManager.AddToRoleAsync(admin, AppRoles.Admin);

        var targetUser = await CreateUserAsync(userManager, "dual@fleetnova.test", "Dual Role User");
        await userManager.AddToRoleAsync(targetUser, AppRoles.User);
        await userManager.AddToRoleAsync(targetUser, AppRoles.Admin);

        var rolesBefore = await userManager.GetRolesAsync(targetUser);
        Assert.Equal(2, rolesBefore.Count);

        var currentUserServiceMock = new Mock<ICurrentUserService>();
        currentUserServiceMock.Setup(x => x.UserId).Returns(admin.Id);

        var service = new UserService(userManager, fixture.Context, currentUserServiceMock.Object);

        // Act
        var result = await service.UpdateRoleAsync(
            targetUser.Id,
            new UpdateUserRoleDto { Role = AppRoles.Admin });

        // Assert
        Assert.Equal(new[] { AppRoles.Admin }, result.Roles);

        var rolesAfter = await userManager.GetRolesAsync(targetUser);
        Assert.Single(rolesAfter);
        Assert.Equal(AppRoles.Admin, rolesAfter[0]);
    }

    [Fact]
    public async Task UpdateRoleAsync_WhenChangingOwnRole_ThrowsConflictException()
    {
        // Arrange
        using var fixture = new SqliteTestDbContextFactory();

        var userManager = fixture.Services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = fixture.Services.GetRequiredService<RoleManager<IdentityRole>>();

        await roleManager.CreateAsync(new IdentityRole(AppRoles.Admin));
        await roleManager.CreateAsync(new IdentityRole(AppRoles.User));

        var admin = await CreateUserAsync(userManager, "self@fleetnova.test", "Self Admin");
        await userManager.AddToRoleAsync(admin, AppRoles.Admin);

        var currentUserServiceMock = new Mock<ICurrentUserService>();
        currentUserServiceMock.Setup(x => x.UserId).Returns(admin.Id);

        var service = new UserService(userManager, fixture.Context, currentUserServiceMock.Object);

        // Act & Assert
        await Assert.ThrowsAsync<ConflictException>(() =>
            service.UpdateRoleAsync(admin.Id, new UpdateUserRoleDto { Role = AppRoles.User }));

        var rolesAfter = await userManager.GetRolesAsync(admin);
        Assert.Single(rolesAfter);
        Assert.Equal(AppRoles.Admin, rolesAfter[0]);
    }

    private static async Task<ApplicationUser> CreateUserAsync(
        UserManager<ApplicationUser> userManager,
        string email,
        string fullName)
    {
        var user = new ApplicationUser
        {
            FullName = fullName,
            Email = email,
            UserName = email,
            CreatedAt = DateTime.UtcNow
        };

        IdentityResult result = await userManager.CreateAsync(user, "P@ssword1");

        if (!result.Succeeded)
        {
            throw new InvalidOperationException(
                string.Join(" ", result.Errors.Select(error => error.Description)));
        }

        return user;
    }
}