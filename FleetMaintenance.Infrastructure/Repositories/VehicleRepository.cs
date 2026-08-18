using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Vehicles;
using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FleetMaintenance.Infrastructure.Repositories;

public class VehicleRepository: GenericRepository<Vehicle>, IVehicleRepository
{
    public VehicleRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public override async Task<List<Vehicle>> GetAllAsync()
    {
        return await Context.Vehicles
            .AsNoTracking()
            .OrderByDescending(vehicle => vehicle.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> PlateNumberExistsAsync(
        string plateNumber,
        int? excludedVehicleId = null)
    {
        string normalizedPlateNumber =
            plateNumber.Trim().ToLower();

        return await Context.Vehicles.AnyAsync(vehicle =>
            vehicle.PlateNumber.ToLower() == normalizedPlateNumber &&
            (!excludedVehicleId.HasValue ||
             vehicle.Id != excludedVehicleId.Value));
    }

    public async Task<PagedResult<Vehicle>> GetPagedAsync(VehicleFilterDto filter)
    {
        IQueryable<Vehicle> query = Context.Vehicles
            .AsNoTracking();

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
                vehicle.Status == filter.Status.Value);
        }

        int totalCount = await query.CountAsync();

        var vehicles = await query
            .OrderByDescending(vehicle => vehicle.CreatedAt)
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PagedResult<Vehicle>
        {
            Items = vehicles,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = totalCount
        };
    }
}