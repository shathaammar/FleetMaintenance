using FleetMaintenance.Application.DTOs.MaintenanceRequests;

namespace FleetMaintenance.Application.Interfaces.Services;

public interface IMaintenanceRequestService
{
    Task<List<MaintenanceRequestDto>> GetAllAsync();

    Task<List<MaintenanceRequestDto>> GetMyRequestsAsync();

    Task<MaintenanceRequestDto> GetByIdAsync(int id);

    Task<MaintenanceRequestDto> GetMyRequestByIdAsync(int id);

    Task<MaintenanceRequestDto> CreateAsync(CreateMaintenanceRequestDto dto);

    Task<MaintenanceRequestDto> ApproveAsync(int id, ApproveMaintenanceRequestDto dto);

    Task<MaintenanceRequestDto> RejectAsync(int id, RejectMaintenanceRequestDto dto);
}