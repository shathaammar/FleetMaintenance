using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRequests;

namespace FleetMaintenance.Application.Interfaces.Services;

public interface IMaintenanceRequestService
{
    Task<MaintenanceRequestDto> GetByIdAsync(int id);

    Task<MaintenanceRequestDto> GetMyRequestByIdAsync(int id);

    Task<PagedResult<MaintenanceRequestDto>> GetPagedAsync(MaintenanceRequestFilterDto filter);

    Task<PagedResult<MaintenanceRequestDto>> GetMyRequestsPagedAsync(MaintenanceRequestFilterDto filter);

    Task<MaintenanceRequestDto> CreateAsync(CreateMaintenanceRequestDto dto);

    Task<MaintenanceRequestDto> ApproveAsync(int id, ApproveMaintenanceRequestDto dto);

    Task<MaintenanceRequestDto> RejectAsync(int id, RejectMaintenanceRequestDto dto);
}