using FleetMaintenance.Application.Common.Authorization;
using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Users;
using FleetMaintenance.Application.Interfaces.Services;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            string search = filter.Search.Trim();

            query = query.Where(user =>
                user.FullName.Contains(search) ||
                (user.Email != null && user.Email.Contains(search)));
        }

        int totalCount = await query.CountAsync();

        List<ApplicationUser> users = await query
            .OrderByDescending(user => user.CreatedAt)
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        List<string> userIds = users
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

        List<UserSummaryDto> items = users
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
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<UserSummaryDto> UpdateRoleAsync(string userId, UpdateUserRoleDto dto)
    {
        string currentUserId = _currentUserService.UserId;

        if (string.Equals(userId, currentUserId, StringComparison.Ordinal))
        {
            throw new ConflictException(
                "You cannot change your own role.");
        }

        ApplicationUser? user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            throw new NotFoundException(
                $"User with ID {userId} was not found.");
        }

        IList<string> currentRoles = await _userManager.GetRolesAsync(user);

        bool isCurrentlyAdmin = currentRoles.Contains(AppRoles.Admin);
        bool targetIsAdmin = dto.Role == AppRoles.Admin;

        if (isCurrentlyAdmin && !targetIsAdmin)
        {
            int adminCount =
                (await _userManager.GetUsersInRoleAsync(AppRoles.Admin)).Count;

            if (adminCount <= 1)
            {
                throw new ConflictException(
                    "Cannot change the role of the last remaining Admin.");
            }
        }

        List<string> rolesToRemove = currentRoles
            .Where(role => role != dto.Role)
            .ToList();

        bool needsAdd = !currentRoles.Contains(dto.Role);

        if (rolesToRemove.Count == 0 && !needsAdd)
        {
            return await MapToDtoAsync(user);
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            if (rolesToRemove.Count > 0)
            {
                IdentityResult removeResult =
                    await _userManager.RemoveFromRolesAsync(user, rolesToRemove);

                if (!removeResult.Succeeded)
                {
                    throw new ConflictException(GetIdentityErrors(removeResult));
                }
            }

            if (needsAdd)
            {
                IdentityResult addResult =
                    await _userManager.AddToRoleAsync(user, dto.Role);

                if (!addResult.Succeeded)
                {
                    throw new ConflictException(GetIdentityErrors(addResult));
                }
            }

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }

        return await MapToDtoAsync(user);
    }

    private async Task<UserSummaryDto> MapToDtoAsync(ApplicationUser user)
    {
        IList<string> roles = await _userManager.GetRolesAsync(user);

        return new UserSummaryDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            Roles = roles.ToList(),
            CreatedAt = user.CreatedAt
        };
    }

    private static string GetIdentityErrors(IdentityResult result)
    {
        return string.Join(
            " ",
            result.Errors.Select(error => error.Description));
    }
}