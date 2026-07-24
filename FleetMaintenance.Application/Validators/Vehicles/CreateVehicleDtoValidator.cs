using FluentValidation;
using FleetMaintenance.Application.DTOs.Vehicles;

namespace FleetMaintenance.Application.Validators.Vehicles;

public class CreateVehicleDtoValidator
    : AbstractValidator<CreateVehicleDto>
{
    public CreateVehicleDtoValidator()
    {
        RuleFor(vehicle => vehicle.PlateNumber)
            .NotEmpty()
            .WithMessage("Plate number is required.")
            .MaximumLength(20)
            .WithMessage("Plate number cannot exceed 20 characters.");

        RuleFor(vehicle => vehicle.Make)
            .NotEmpty()
            .WithMessage("Vehicle make is required.")
            .MaximumLength(50)
            .WithMessage("Vehicle make cannot exceed 50 characters.");

        RuleFor(vehicle => vehicle.Model)
            .NotEmpty()
            .WithMessage("Vehicle model is required.")
            .MaximumLength(50)
            .WithMessage("Vehicle model cannot exceed 50 characters.");

        RuleFor(vehicle => vehicle.Year)
            .InclusiveBetween(1900, DateTime.UtcNow.Year + 1)
            .WithMessage(
                $"Year must be between 1900 and {DateTime.UtcNow.Year + 1}.");

        RuleFor(vehicle => vehicle.CurrentMileage)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Current mileage cannot be negative.");
    }
}