using FleetMaintenance.Application.DTOs.MaintenanceTypes;

namespace FleetMaintenance.Application.Interfaces.Services
{
    public interface IMaintenanceTypeService
    {
        Task<IEnumerable<MaintenanceTypeDto>> GetAllAsync();

        Task<MaintenanceTypeDto> GetByIdAsync(int id);

        Task<MaintenanceTypeDto> CreateAsync(CreateMaintenanceTypeDto dto);

        Task<MaintenanceTypeDto> UpdateAsync(int id, UpdateMaintenanceTypeDto dto);

        Task DeleteAsync(int id);
    }
}