using FleetMaintenance.Application.Interfaces.UnitOfWork;
using FleetMaintenance.Infrastructure.Data;

namespace FleetMaintenance.Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task ExecuteInTransactionAsync(
        Func<Task> operation)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            await operation();

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}