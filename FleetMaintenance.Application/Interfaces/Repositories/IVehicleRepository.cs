using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Vehicles;
using FleetMaintenance.Domain.Entities;

namespace FleetMaintenance.Application.Interfaces.Repositories;

public interface IVehicleRepository
    : IGenericRepository<Vehicle>
{
    Task<bool> PlateNumberExistsAsync(
        string plateNumber,
        int? excludedVehicleId = null);

    Task<bool> IsUsedAsync(int id);

    Task<PagedResult<Vehicle>> GetPagedAsync(
        VehicleFilterDto filter);
}