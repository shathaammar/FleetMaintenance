using FluentValidation;
using FleetMaintenance.Application.DTOs.MaintenanceTypes;

namespace FleetMaintenance.Application.Validators.MaintenanceTypes;

public class CreateMaintenanceTypeDtoValidator
    : AbstractValidator<CreateMaintenanceTypeDto>
{
    public CreateMaintenanceTypeDtoValidator()
    {
        RuleFor(type => type.Name)
            .NotEmpty()
            .WithMessage("Maintenance type name is required.")
            .MaximumLength(100)
            .WithMessage(
                "Maintenance type name cannot exceed 100 characters.");

        RuleFor(type => type.Description)
            .MaximumLength(500)
            .WithMessage(
                "Description cannot exceed 500 characters.");
    }
}