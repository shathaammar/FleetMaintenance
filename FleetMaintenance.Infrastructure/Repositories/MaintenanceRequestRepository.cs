using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Domain.Enums;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FleetMaintenance.Infrastructure.Repositories;

public class MaintenanceRequestRepository: GenericRepository<MaintenanceRequest>, IMaintenanceRequestRepository
{
    public MaintenanceRequestRepository(
        ApplicationDbContext context)
        : base(context)
    {
    }

    public async Task<List<MaintenanceRequest>> GetAllWithDetailsAsync()
    {
        return await Context.MaintenanceRequests
            .AsNoTracking()
            .Include(request => request.Vehicle)
            .Include(request => request.MaintenanceType)
            .OrderByDescending(request => request.RequestedAt)
            .ToListAsync();
    }

    public async Task<List<MaintenanceRequest>> GetByUserIdWithDetailsAsync(string userId)
    {
        return await Context.MaintenanceRequests
            .AsNoTracking()
            .Include(request => request.Vehicle)
            .Include(request => request.MaintenanceType)
            .Where(request =>
                request.RequestedByUserId == userId)
            .OrderByDescending(request => request.RequestedAt)
            .ToListAsync();
    }

    public async Task<MaintenanceRequest?> GetByIdWithDetailsAsync(int id)
    {
        return await Context.MaintenanceRequests
            .AsNoTracking()
            .Include(request => request.Vehicle)
            .Include(request => request.MaintenanceType)
            .FirstOrDefaultAsync(request =>
                request.Id == id);
    }

    public async Task<bool> HasPendingRequestAsync(string userId, int vehicleId, int maintenanceTypeId)
    {
        return await Context.MaintenanceRequests
            .AsNoTracking()
            .AnyAsync(request =>
                request.RequestedByUserId == userId &&
                request.VehicleId == vehicleId &&
                request.MaintenanceTypeId ==
                    maintenanceTypeId &&
                request.Status ==
                    MaintenanceRequestStatus.Pending);
    }
}