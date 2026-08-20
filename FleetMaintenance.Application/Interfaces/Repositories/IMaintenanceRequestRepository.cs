using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRequests;
using FleetMaintenance.Domain.Entities;

namespace FleetMaintenance.Application.Interfaces.Repositories;

public interface IMaintenanceRequestRepository: IGenericRepository<MaintenanceRequest>
{
    Task<MaintenanceRequest?> GetByIdWithDetailsAsync(int id);
    Task<PagedResult<MaintenanceRequest>> GetPagedAsync(MaintenanceRequestFilterDto filter);

    Task<PagedResult<MaintenanceRequest>> GetPagedByUserIdAsync(MaintenanceRequestFilterDto filter, string userId);

    Task<bool> HasPendingRequestAsync(string userId, int vehicleId, int maintenanceTypeId);
}