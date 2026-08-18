using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FleetMaintenance.Infrastructure.Repositories;

public class MaintenanceRecordRepository: GenericRepository<MaintenanceRecord>, IMaintenanceRecordRepository
{
    public MaintenanceRecordRepository(
        ApplicationDbContext context)
        : base(context)
    {
    }

    public async Task<List<MaintenanceRecord>> GetAllWithDetailsAsync()
    {
        return await Context.MaintenanceRecords
            .AsNoTracking()
            .Include(record => record.Vehicle)
            .Include(record => record.MaintenanceType)
            .OrderByDescending(record => record.ScheduledDate)
            .ToListAsync();
    }

    public async Task<MaintenanceRecord?> GetByIdWithDetailsAsync(int id)
    {
        return await Context.MaintenanceRecords
            .AsNoTracking()
            .Include(record => record.Vehicle)
            .Include(record => record.MaintenanceType)
            .FirstOrDefaultAsync(record => record.Id == id);
    }

    public async Task<List<MaintenanceRecord>> GetByVehicleIdAsync(int vehicleId)
    {
        return await Context.MaintenanceRecords
            .AsNoTracking()
            .Include(record => record.Vehicle)
            .Include(record => record.MaintenanceType)
            .Where(record => record.VehicleId == vehicleId)
            .OrderByDescending(record => record.ScheduledDate)
            .ToListAsync();
    }
}