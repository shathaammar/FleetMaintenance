using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRecords;

namespace FleetMaintenance.Application.Interfaces.Services;

public interface IMaintenanceRecordService
{
    Task<List<MaintenanceRecordDto>> GetAllAsync();
    Task<PagedResult<MaintenanceRecordDto>> GetPagedAsync(MaintenanceRecordFilterDto filter);

    Task<MaintenanceRecordDto> GetByIdAsync(int id);

    Task<List<MaintenanceRecordDto>> GetByVehicleIdAsync(int vehicleId);

    Task<MaintenanceRecordDto> CreateAsync(CreateMaintenanceRecordDto dto);

    Task<MaintenanceRecordDto> UpdateAsync(int id, UpdateMaintenanceRecordDto dto);

    Task<MaintenanceRecordDto> CompleteAsync(int id, CompleteMaintenanceRecordDto dto);

    Task<MaintenanceRecordDto> CancelAsync(int id);

    Task DeleteAsync(int id);
}