using FluentValidation;
using FleetMaintenance.Application.DTOs.Vehicles;

namespace FleetMaintenance.Application.Validators.Vehicles;

public class UpdateVehicleDtoValidator
    : AbstractValidator<UpdateVehicleDto>
{
    public UpdateVehicleDtoValidator()
    {
        RuleFor(vehicle => vehicle)
            .Must(HaveAtLeastOneValue)
            .WithMessage("At least one field must be provided.");

        RuleFor(vehicle => vehicle.PlateNumber)
            .NotEmpty()
            .MaximumLength(20)
            .When(vehicle => vehicle.PlateNumber is not null);

        RuleFor(vehicle => vehicle.Make)
            .NotEmpty()
            .MaximumLength(50)
            .When(vehicle => vehicle.Make is not null);

        RuleFor(vehicle => vehicle.Model)
            .NotEmpty()
            .MaximumLength(50)
            .When(vehicle => vehicle.Model is not null);

        RuleFor(vehicle => vehicle.Year)
            .InclusiveBetween(1900, DateTime.UtcNow.Year + 1)
            .When(vehicle => vehicle.Year.HasValue);

        RuleFor(vehicle => vehicle.CurrentMileage)
            .GreaterThanOrEqualTo(0)
            .When(vehicle => vehicle.CurrentMileage.HasValue);

        RuleFor(vehicle => vehicle.Status)
            .IsInEnum()
            .When(vehicle => vehicle.Status.HasValue);
    }

    private static bool HaveAtLeastOneValue(UpdateVehicleDto dto)
    {
        return dto.PlateNumber is not null
            || dto.Make is not null
            || dto.Model is not null
            || dto.Year.HasValue
            || dto.CurrentMileage.HasValue
            || dto.Status.HasValue;
    }
}