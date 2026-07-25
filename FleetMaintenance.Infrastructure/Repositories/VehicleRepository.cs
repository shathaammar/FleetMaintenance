using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FleetMaintenance.Infrastructure.Repositories;

public class VehicleRepository
    : GenericRepository<Vehicle>, IVehicleRepository
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
}