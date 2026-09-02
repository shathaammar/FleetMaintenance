using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRecords;
using FleetMaintenance.Domain.Entities;

namespace FleetMaintenance.Application.Interfaces.Repositories;

public interface IMaintenanceRecordRepository
    : IGenericRepository<MaintenanceRecord>
{
    Task<PagedResult<MaintenanceRecord>> GetPagedAsync(
        MaintenanceRecordFilterDto filter);

    Task<MaintenanceRecord?> GetByIdWithDetailsAsync(
        int id);

    Task<List<MaintenanceRecord>> GetByVehicleIdAsync(
        int vehicleId);

    Task<bool> HasScheduledDuplicateAsync(
        int vehicleId,
        int maintenanceTypeId,
        DateTime scheduledDate,
        int? excludedRecordId = null);

    Task<bool> IsLinkedToRequestAsync(int recordId);
}