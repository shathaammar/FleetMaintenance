using FleetMaintenance.Domain.Entities;

namespace FleetMaintenance.Application.Interfaces.Repositories;

public interface IMaintenanceRecordRepository
    : IGenericRepository<MaintenanceRecord>
{
    Task<List<MaintenanceRecord>> GetAllWithDetailsAsync();

    Task<MaintenanceRecord?> GetByIdWithDetailsAsync(int id);

    Task<List<MaintenanceRecord>> GetByVehicleIdAsync(int vehicleId);
}