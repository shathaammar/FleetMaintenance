using FleetMaintenance.Domain.Entities;

namespace FleetMaintenance.Application.Interfaces.Repositories
{
    public interface IVehicleRepository
    {
        Task<bool> PlateNumberExistsAsync(string plateNumber, int? excludedVehicleId = null);
    }
}
