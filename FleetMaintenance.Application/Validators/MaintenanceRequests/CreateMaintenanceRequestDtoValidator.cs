using FleetMaintenance.Application.DTOs.MaintenanceRequests;
using FluentValidation;

namespace FleetMaintenance.Application.Validators.MaintenanceRequests;

public class CreateMaintenanceRequestDtoValidator
    : AbstractValidator<CreateMaintenanceRequestDto>
{
    public CreateMaintenanceRequestDtoValidator()
    {
        RuleFor(dto => dto.VehicleId)
            .GreaterThan(0)
            .WithMessage("Vehicle is required.");

        RuleFor(dto => dto.MaintenanceTypeId)
            .GreaterThan(0)
            .WithMessage("Maintenance type is required.");

        RuleFor(dto => dto.Description)
            .NotEmpty()
            .WithMessage("Description is required.")
            .MaximumLength(1000)
            .WithMessage(
                "Description cannot exceed 1000 characters.");

        RuleFor(dto => dto.PreferredDate)
            .Must(date =>
                date is null ||
                date.Value.Date >= DateTime.UtcNow.Date)
            .WithMessage(
                "Preferred date cannot be in the past.");
    }
}