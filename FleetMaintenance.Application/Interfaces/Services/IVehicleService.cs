using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Vehicles;

namespace FleetMaintenance.Application.Interfaces.Services
{
    public interface IVehicleService
    {
        Task<List<VehicleDto>> GetAllAsync();
        Task<PagedResult<VehicleDto>> GetPagedAsync(VehicleFilterDto filter);

        Task<VehicleDto> GetByIdAsync(int id);

        Task<VehicleDto> CreateAsync(CreateVehicleDto dto);

        Task<VehicleDto> UpdateAsync(int id, UpdateVehicleDto dto);

        Task DeleteAsync(int id);
    }
}
