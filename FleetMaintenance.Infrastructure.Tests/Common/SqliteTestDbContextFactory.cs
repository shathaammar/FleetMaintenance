using FleetMaintenance.Infrastructure.Data;
using FleetMaintenance.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FleetMaintenance.Infrastructure.Tests.Common;

/// <summary>
/// Builds an isolated, in-memory SQLite-backed ApplicationDbContext together
/// with a real ASP.NET Identity stack (UserManager/RoleManager) wired to that
/// same context. Each instance owns its own open SqliteConnection, so each
/// test using its own instance gets a fully isolated database.
/// </summary>
public sealed class SqliteTestDbContextFactory : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly ServiceProvider _rootProvider;
    private readonly IServiceScope _scope;

    public ApplicationDbContext Context { get; }

    public IServiceProvider Services => _scope.ServiceProvider;

    public SqliteTestDbContextFactory()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var services = new ServiceCollection();

        services.AddLogging();
        services.AddDataProtection();

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(_connection));

        services
            .AddIdentityCore<ApplicationUser>(options =>
            {
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireDigit = false;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        _rootProvider = services.BuildServiceProvider();
        _scope = _rootProvider.CreateScope();

        Context = _scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        Context.Database.EnsureCreated();
    }

    public void Dispose()
    {
        _scope.Dispose();
        _rootProvider.Dispose();
        _connection.Dispose();
    }
}