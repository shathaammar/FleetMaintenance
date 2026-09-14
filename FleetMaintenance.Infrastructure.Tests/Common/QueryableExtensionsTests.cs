using FleetMaintenance.Infrastructure.Common.Extensions;
using FleetMaintenance.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace FleetMaintenance.Infrastructure.Tests.Common;

public class QueryableExtensionsTests
{
    [Fact]
    public async Task ToPagedResultAsync_ReturnsCorrectPageAndTotalCount()
    {
        // Arrange
        using var fixture = new SqliteTestDbContextFactory();

        for (int i = 1; i <= 5; i++)
        {
            fixture.Context.Users.Add(new ApplicationUser
            {
                FullName = $"User {i:D2}",
                Email = $"user{i}@fleetnova.test",
                UserName = $"user{i}@fleetnova.test",
                CreatedAt = DateTime.UtcNow.AddMinutes(i)
            });
        }

        await fixture.Context.SaveChangesAsync();

        IQueryable<ApplicationUser> query = fixture.Context.Users
            .AsNoTracking()
            .OrderBy(user => user.FullName);

        // Act
        var page = await query.ToPagedResultAsync(pageNumber: 2, pageSize: 2);

        // Assert
        Assert.Equal(5, page.TotalCount);
        Assert.Equal(2, page.PageNumber);
        Assert.Equal(2, page.PageSize);
        Assert.Equal(2, page.Items.Count);
        Assert.Equal("User 03", page.Items[0].FullName);
        Assert.Equal("User 04", page.Items[1].FullName);
    }

    [Fact]
    public async Task ToPagedResultAsync_WhenPageBeyondLastPage_ReturnsEmptyItemsWithCorrectTotalCount()
    {
        // Arrange
        using var fixture = new SqliteTestDbContextFactory();

        for (int i = 1; i <= 3; i++)
        {
            fixture.Context.Users.Add(new ApplicationUser
            {
                FullName = $"User {i:D2}",
                Email = $"userx{i}@fleetnova.test",
                UserName = $"userx{i}@fleetnova.test",
                CreatedAt = DateTime.UtcNow.AddMinutes(i)
            });
        }

        await fixture.Context.SaveChangesAsync();

        IQueryable<ApplicationUser> query = fixture.Context.Users
            .AsNoTracking()
            .OrderBy(user => user.FullName);

        // Act
        var page = await query.ToPagedResultAsync(pageNumber: 5, pageSize: 2);

        // Assert
        Assert.Equal(3, page.TotalCount);
        Assert.Empty(page.Items);
    }
}