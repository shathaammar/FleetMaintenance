namespace FleetMaintenance.Application.Interfaces.UnitOfWork;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync();

    Task ExecuteInTransactionAsync(Func<Task> operation);
}