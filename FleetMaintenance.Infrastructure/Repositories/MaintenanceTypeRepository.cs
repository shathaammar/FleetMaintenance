using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FleetMaintenance.Infrastructure.Repositories;

public class MaintenanceTypeRepository: GenericRepository<MaintenanceType>, IMaintenanceTypeRepository
{
    public MaintenanceTypeRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public override async Task<List<MaintenanceType>> GetAllAsync()
    {
        return await Context.MaintenanceTypes
            .AsNoTracking()
            .OrderBy(type => type.Name)
            .ToListAsync();
    }

    public async Task<bool> NameExistsAsync(
        string name,
        int? excludedId = null)
    {
        string normalizedName = name.Trim().ToLower();

        return await Context.MaintenanceTypes.AnyAsync(type =>
            type.Name.ToLower() == normalizedName &&
            (!excludedId.HasValue ||
             type.Id != excludedId.Value));
    }

    public async Task<bool> IsUsedAsync(int id)
    {
        return await Context.MaintenanceRecords
            .AnyAsync(record => record.MaintenanceTypeId == id);
    }
}