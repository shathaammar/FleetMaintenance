using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRecords;
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

    public async Task<PagedResult<MaintenanceRecord>> GetPagedAsync(MaintenanceRecordFilterDto filter)
    {
        IQueryable<MaintenanceRecord> query =
            Context.MaintenanceRecords
                .AsNoTracking()
                .Include(record => record.Vehicle)
                .Include(record => record.MaintenanceType);

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            string search = filter.Search.Trim();

            query = query.Where(record =>
                record.Vehicle.PlateNumber.Contains(search) ||
                record.MaintenanceType.Name.Contains(search));
        }

        if (filter.VehicleId.HasValue)
        {
            query = query.Where(record =>
                record.VehicleId == filter.VehicleId.Value);
        }

        if (filter.MaintenanceTypeId.HasValue)
        {
            query = query.Where(record =>
                record.MaintenanceTypeId ==
                filter.MaintenanceTypeId.Value);
        }

        if (filter.Status.HasValue)
        {
            query = query.Where(record =>
                record.Status == filter.Status.Value);
        }

        if (filter.FromDate.HasValue)
        {
            DateTime fromDate = filter.FromDate.Value.Date;

            query = query.Where(record =>
                record.ScheduledDate >= fromDate);
        }

        if (filter.ToDate.HasValue)
        {
            DateTime toDateExclusive =
                filter.ToDate.Value.Date.AddDays(1);

            query = query.Where(record =>
                record.ScheduledDate < toDateExclusive);
        }

        int totalCount = await query.CountAsync();

        var records = await query
            .OrderByDescending(record => record.ScheduledDate)
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PagedResult<MaintenanceRecord>
        {
            Items = records,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = totalCount
        };
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