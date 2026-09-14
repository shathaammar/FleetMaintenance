using FleetMaintenance.Application.Interfaces.Services;
using FleetMaintenance.Application.Services;
using FleetMaintenance.Application.Validators.MaintenanceTypes;
using FleetMaintenance.Application.Validators.Vehicles;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace FleetMaintenance.Application;

public static class ApplicationServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddScoped<IVehicleService, VehicleService>();
        services.AddScoped<IMaintenanceTypeService, MaintenanceTypeService>();
        services.AddScoped<IMaintenanceRecordService, MaintenanceRecordService>();
        services.AddScoped<IMaintenanceRequestService, MaintenanceRequestService>();
        services.AddScoped<IDashboardService, DashboardService>();

        services.AddValidatorsFromAssemblyContaining<CreateVehicleDtoValidator>();

        services.AddValidatorsFromAssemblyContaining<CreateMaintenanceTypeDtoValidator>();

        return services;
    }
}