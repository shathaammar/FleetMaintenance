using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRequests;
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

    public async Task<MaintenanceRequest?> GetByIdWithDetailsAsync(int id)
    {
        return await Context.MaintenanceRequests
            .AsNoTracking()
            .Include(request => request.Vehicle)
            .Include(request => request.MaintenanceType)
            .FirstOrDefaultAsync(request =>
                request.Id == id);
    }

    public async Task<PagedResult<MaintenanceRequest>> GetPagedAsync(MaintenanceRequestFilterDto filter)
    {
        IQueryable<MaintenanceRequest> query = CreateDetailsQuery();

        query = ApplyFilters(query, filter);

        return await CreatePagedResultAsync(query, filter);
    }

    public async Task<PagedResult<MaintenanceRequest>> GetPagedByUserIdAsync(MaintenanceRequestFilterDto filter, string userId)
    {
        IQueryable<MaintenanceRequest> query = CreateDetailsQuery()
                .Where(request => request.RequestedByUserId == userId);

        query = ApplyFilters(query, filter);

        return await CreatePagedResultAsync(
            query,
            filter);
    }

    private IQueryable<MaintenanceRequest> CreateDetailsQuery()
    {
        return Context.MaintenanceRequests
            .AsNoTracking()
            .Include(request => request.Vehicle)
            .Include(request => request.MaintenanceType);
    }

    private static IQueryable<MaintenanceRequest> ApplyFilters(IQueryable<MaintenanceRequest> query, MaintenanceRequestFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            string search = filter.Search.Trim();

            query = query.Where(request => request.Vehicle.PlateNumber.Contains(search) ||
            request.MaintenanceType.Name.Contains(search) ||
            request.Description.Contains(search) || 
            request.RequestedByFullName.Contains(search) ||
            request.RequestedByEmail.Contains(search));
        }

        if (filter.Status.HasValue)
        {
            query = query.Where(request => request.Status == filter.Status.Value);
        }

        if (filter.FromDate.HasValue)
        {
            DateTime fromDate = filter.FromDate.Value.Date;

            query = query.Where(request => request.RequestedAt >= fromDate);
        }

        if (filter.ToDate.HasValue)
        {
            DateTime toDateExclusive = filter.ToDate.Value.Date.AddDays(1);

            query = query.Where(request => request.RequestedAt < toDateExclusive);
        }

        return query;
    }

    private static async Task<PagedResult<MaintenanceRequest>> CreatePagedResultAsync(IQueryable<MaintenanceRequest> query, MaintenanceRequestFilterDto filter)
    {
        int totalCount = await query.CountAsync();

        List<MaintenanceRequest> requests = await query
                .OrderByDescending(request =>
                    request.RequestedAt)
                .Skip(
                    (filter.PageNumber - 1) *
                    filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

        return new PagedResult<MaintenanceRequest>
        {
            Items = requests,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = totalCount
        };
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