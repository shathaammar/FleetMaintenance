using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Users;

namespace FleetMaintenance.Application.Interfaces.Services;

public interface IUserService
{
    Task<PagedResult<UserSummaryDto>> GetPagedAsync(UserFilterDto filter);

    Task<UserSummaryDto> UpdateRoleAsync(string userId, UpdateUserRoleDto dto);
}