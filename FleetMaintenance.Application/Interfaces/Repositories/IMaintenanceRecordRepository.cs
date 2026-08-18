using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRecords;
using FleetMaintenance.Domain.Entities;

namespace FleetMaintenance.Application.Interfaces.Repositories;

public interface IMaintenanceRecordRepository
    : IGenericRepository<MaintenanceRecord>
{
    Task<List<MaintenanceRecord>> GetAllWithDetailsAsync();
    Task<PagedResult<MaintenanceRecord>> GetPagedAsync(MaintenanceRecordFilterDto filter);

    Task<MaintenanceRecord?> GetByIdWithDetailsAsync(int id);

    Task<List<MaintenanceRecord>> GetByVehicleIdAsync(int vehicleId);
}