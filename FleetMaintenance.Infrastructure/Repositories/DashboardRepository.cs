using FleetMaintenance.Application.DTOs.Dashboard;
using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Domain.Enums;
using FleetMaintenance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FleetMaintenance.Infrastructure.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly ApplicationDbContext _context;

    public DashboardRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardDto> GetDashboardAsync()
    {
        DateTime currentTime = DateTime.UtcNow;

        var vehicleStatusCounts = await _context.Vehicles
            .AsNoTracking()
            .GroupBy(vehicle => vehicle.Status)
            .Select(group => new
            {
                Status = group.Key,
                Count = group.Count()
            })
            .ToDictionaryAsync(
                item => item.Status,
                item => item.Count);

        int scheduledMaintenances = await _context.MaintenanceRecords
                .AsNoTracking()
                .CountAsync(record =>
                    record.Status == MaintenanceStatus.Scheduled &&
                    record.ScheduledDate >= currentTime);

        int overdueMaintenances = await _context.MaintenanceRecords
                .AsNoTracking()
                .CountAsync(record =>
                    record.Status == MaintenanceStatus.Scheduled &&
                    record.ScheduledDate < currentTime);

        int completedMaintenances = await _context.MaintenanceRecords
                .AsNoTracking()
                .CountAsync(record =>
                    record.Status == MaintenanceStatus.Completed);

        decimal totalMaintenanceCost = await _context.MaintenanceRecords
                .AsNoTracking()
                .Where(record =>
                    record.Status == MaintenanceStatus.Completed)
                .SumAsync(record => record.Cost ?? 0);

        var upcomingMaintenances = await _context.MaintenanceRecords
                .AsNoTracking()
                .Where(record =>
                    record.Status == MaintenanceStatus.Scheduled &&
                    record.ScheduledDate >= currentTime)
                .OrderBy(record => record.ScheduledDate)
                .Take(5)
                .Select(record => new UpcomingMaintenanceDto
                {
                    MaintenanceRecordId = record.Id,
                    VehicleId = record.VehicleId,
                    PlateNumber = record.Vehicle.PlateNumber,
                    MaintenanceTypeName =
                        record.MaintenanceType.Name,
                    ScheduledDate = record.ScheduledDate,
                    DueMileage = record.DueMileage
                })
                .ToListAsync();

        return new DashboardDto
        {
            TotalVehicles = vehicleStatusCounts.Values.Sum(),

            ActiveVehicles = GetStatusCount(
                vehicleStatusCounts,
                VehicleStatus.Active),

            VehiclesInMaintenance = GetStatusCount(
                vehicleStatusCounts,
                VehicleStatus.InMaintenance),

            OutOfServiceVehicles = GetStatusCount(
                vehicleStatusCounts,
                VehicleStatus.OutOfService),

            ScheduledMaintenances = scheduledMaintenances,
            OverdueMaintenances = overdueMaintenances,
            CompletedMaintenances = completedMaintenances,
            TotalMaintenanceCost = totalMaintenanceCost,
            UpcomingMaintenances = upcomingMaintenances
        };
    }

    private static int GetStatusCount(
        Dictionary<VehicleStatus, int> counts,
        VehicleStatus status)
    {
        return counts.TryGetValue(status, out int count)
            ? count
            : 0;
    }
}