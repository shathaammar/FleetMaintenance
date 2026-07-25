using FluentValidation;
using FleetMaintenance.Application.DTOs.MaintenanceTypes;

namespace FleetMaintenance.Application.Validators.MaintenanceTypes;

public class UpdateMaintenanceTypeDtoValidator
    : AbstractValidator<UpdateMaintenanceTypeDto>
{
    public UpdateMaintenanceTypeDtoValidator()
    {
        RuleFor(type => type)
            .Must(HaveAtLeastOneValue)
            .WithMessage("At least one field must be provided.");

        RuleFor(type => type.Name)
            .NotEmpty()
            .WithMessage("Maintenance type name cannot be empty.")
            .MaximumLength(100)
            .WithMessage(
                "Maintenance type name cannot exceed 100 characters.")
            .When(type => type.Name is not null);

        RuleFor(type => type.Description)
            .MaximumLength(500)
            .WithMessage(
                "Description cannot exceed 500 characters.")
            .When(type => type.Description is not null);
    }

    private static bool HaveAtLeastOneValue(
        UpdateMaintenanceTypeDto dto)
    {
        return dto.Name is not null ||
               dto.Description is not null;
    }
}