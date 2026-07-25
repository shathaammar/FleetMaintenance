using FleetMaintenance.Domain.Entities;

namespace FleetMaintenance.Application.Interfaces.Repositories;

public interface IMaintenanceTypeRepository
    : IGenericRepository<MaintenanceType>
{
    Task<bool> NameExistsAsync(string name, int? excludedId = null);

    Task<bool> IsUsedAsync(int id);
}