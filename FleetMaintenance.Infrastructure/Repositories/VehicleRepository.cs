using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Vehicles;
using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Domain.Enums;
using FleetMaintenance.Infrastructure.Common.Extensions;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FleetMaintenance.Infrastructure.Repositories;

public class VehicleRepository
    : GenericRepository<Vehicle>,
      IVehicleRepository
{
    public VehicleRepository(
        ApplicationDbContext context)
        : base(context)
    {
    }

    public override async Task<List<Vehicle>> GetAllAsync()
    {
        return await Context.Vehicles
            .AsNoTracking()
            .OrderByDescending(vehicle =>
                vehicle.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> PlateNumberExistsAsync(string plateNumber, int? excludedVehicleId = null)
    {
        string normalizedPlateNumber =
            plateNumber.Trim().ToUpper();

        return await Context.Vehicles
            .AnyAsync(vehicle =>
                vehicle.PlateNumber.ToUpper() ==
                    normalizedPlateNumber &&
                (!excludedVehicleId.HasValue ||
                 vehicle.Id !=
                    excludedVehicleId.Value));
    }

    public async Task<bool> IsUsedAsync(int id)
    {
        bool usedByMaintenanceRecords =
            await Context.MaintenanceRecords
                .AnyAsync(record =>
                    record.VehicleId == id);

        if (usedByMaintenanceRecords)
        {
            return true;
        }

        bool usedByMaintenanceRequests =
            await Context.MaintenanceRequests
                .AnyAsync(request =>
                    request.VehicleId == id);

        return usedByMaintenanceRequests;
    }

    public async Task<int?> GetMaxCompletedMileageAsync(int vehicleId)
    {
        return await Context.MaintenanceRecords
            .Where(record =>
                record.VehicleId == vehicleId &&
                record.Status == MaintenanceStatus.Completed)
            .MaxAsync(record => (int?)record.MileageAtService);
    }

    public async Task<PagedResult<Vehicle>> GetPagedAsync(VehicleFilterDto filter)
    {
        IQueryable<Vehicle> query =
            Context.Vehicles.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            string search = filter.Search.Trim();

            query = query.Where(vehicle =>
                vehicle.PlateNumber.Contains(search) ||
                vehicle.Make.Contains(search) ||
                vehicle.Model.Contains(search));
        }

        if (filter.Status.HasValue)
        {
            query = query.Where(vehicle =>
                vehicle.Status ==
                    filter.Status.Value);
        }

        query = query.OrderByDescending(vehicle =>
            vehicle.CreatedAt);

        return await query.ToPagedResultAsync(
            filter.PageNumber,
            filter.PageSize);
    }
}