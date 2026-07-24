using FleetMaintenance.Domain.Entities;

namespace FleetMaintenance.Application.Interfaces.Repositories
{
    public interface IVehicleRepository
    {
        Task<List<Vehicle>> GetAllAsync();

        Task<Vehicle?> GetByIdAsync(int id);

        Task<bool> PlateNumberExistsAsync(
            string plateNumber,
            int? excludedVehicleId = null);

        Task AddAsync(Vehicle vehicle);

        void Update(Vehicle vehicle);

        void Delete(Vehicle vehicle);

        Task<int> SaveChangesAsync();
    }
}
