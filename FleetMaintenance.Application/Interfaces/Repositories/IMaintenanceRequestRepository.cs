using FleetMaintenance.Domain.Entities;

namespace FleetMaintenance.Application.Interfaces.Repositories;

public interface IMaintenanceRequestRepository: IGenericRepository<MaintenanceRequest>
{
    Task<List<MaintenanceRequest>> GetAllWithDetailsAsync();

    Task<List<MaintenanceRequest>> GetByUserIdWithDetailsAsync(string userId);

    Task<MaintenanceRequest?> GetByIdWithDetailsAsync(int id);

    Task<bool> HasPendingRequestAsync(string userId, int vehicleId, int maintenanceTypeId);
}