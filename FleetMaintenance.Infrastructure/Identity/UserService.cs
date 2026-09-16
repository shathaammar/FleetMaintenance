using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Users;
using FleetMaintenance.Application.Interfaces.Services;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using FleetMaintenance.Infrastructure.Common.Extensions;

namespace FleetMaintenance.Infrastructure.Identity;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UserService(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _userManager = userManager;
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<PagedResult<UserSummaryDto>> GetPagedAsync(UserFilterDto filter)
    {
        IQueryable<ApplicationUser> query =
            _context.Users.AsNoTracking();

        query = query.Where(user =>
            user.Id != _currentUserService.UserId);

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            string search = filter.Search.Trim();

            query = query.Where(user =>
                user.FullName.Contains(search) ||
                (user.Email != null && user.Email.Contains(search)));
        }

        query = query.OrderByDescending(user => user.CreatedAt);

        PagedResult<ApplicationUser> pagedUsers =
            await query.ToPagedResultAsync(filter.PageNumber, filter.PageSize);

        List<string> userIds = pagedUsers.Items
            .Select(user => user.Id)
            .ToList();

        var roleRows = await (
            from userRole in _context.UserRoles
            join role in _context.Roles
                on userRole.RoleId equals role.Id
            where userIds.Contains(userRole.UserId)
            select new { userRole.UserId, RoleName = role.Name }
        ).ToListAsync();

        Dictionary<string, List<string>> rolesByUserId = roleRows
            .GroupBy(row => row.UserId)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Select(row => row.RoleName ?? string.Empty)
                    .ToList());

        List<UserSummaryDto> items = pagedUsers.Items
            .Select(user => new UserSummaryDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Roles = rolesByUserId.TryGetValue(user.Id, out List<string>? roles)
                    ? roles
                    : new List<string>(),
                CreatedAt = user.CreatedAt
            })
            .ToList();

        return new PagedResult<UserSummaryDto>
        {
            Items = items,
            PageNumber = pagedUsers.PageNumber,
            PageSize = pagedUsers.PageSize,
            TotalCount = pagedUsers.TotalCount
        };
    }

    public async Task<UserSummaryDto> UpdateRoleAsync(string userId, UpdateUserRoleDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            throw new NotFoundException("User was not found.");
        }

        if (user.Id == _currentUserService.UserId)
        {
            throw new ConflictException("You cannot change your own role.");
        }

        IList<string> currentRoles = await _userManager.GetRolesAsync(user);

        // Remove all current roles then add the requested one
        if (currentRoles.Any())
        {
            IdentityResult removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);

            if (!removeResult.Succeeded)
            {
                throw new ConflictException(string.Join(" ", removeResult.Errors.Select(e => e.Description)));
            }
        }

        IdentityResult addResult = await _userManager.AddToRoleAsync(user, dto.Role);

        if (!addResult.Succeeded)
        {
            throw new ConflictException(string.Join(" ", addResult.Errors.Select(e => e.Description)));
        }

        IList<string> rolesAfter = await _userManager.GetRolesAsync(user);

        return new UserSummaryDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            Roles = rolesAfter.ToList(),
            CreatedAt = user.CreatedAt
        };
    }
}