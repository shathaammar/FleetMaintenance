using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FleetMaintenance.Infrastructure.Repositories;

public class VehicleRepository : IVehicleRepository
{
    private readonly ApplicationDbContext _context;

    public VehicleRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Vehicle>> GetAllAsync()
    {
        return await _context.Vehicles
            .AsNoTracking()
            .OrderByDescending(vehicle => vehicle.CreatedAt)
            .ToListAsync();
    }

    public async Task<Vehicle?> GetByIdAsync(int id)
    {
        return await _context.Vehicles
            .FirstOrDefaultAsync(vehicle => vehicle.Id == id);
    }

    public async Task<bool> PlateNumberExistsAsync(
        string plateNumber,
        int? excludedVehicleId = null)
    {
        string normalizedPlateNumber = plateNumber.Trim().ToLower();

        return await _context.Vehicles.AnyAsync(vehicle =>
            vehicle.PlateNumber.ToLower() == normalizedPlateNumber &&
            (!excludedVehicleId.HasValue ||
             vehicle.Id != excludedVehicleId.Value));
    }

    public async Task AddAsync(Vehicle vehicle)
    {
        await _context.Vehicles.AddAsync(vehicle);
    }

    public void Update(Vehicle vehicle)
    {
        _context.Vehicles.Update(vehicle);
    }

    public void Delete(Vehicle vehicle)
    {
        _context.Vehicles.Remove(vehicle);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}