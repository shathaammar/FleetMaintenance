using FluentValidation;
using FleetMaintenance.Application.DTOs.MaintenanceRecords;

namespace FleetMaintenance.Application.Validators.MaintenanceRecords;

public class CompleteMaintenanceRecordDtoValidator
    : AbstractValidator<CompleteMaintenanceRecordDto>
{
    public CompleteMaintenanceRecordDtoValidator()
    {
        RuleFor(record => record.CompletedDate)
            .NotEmpty()
            .WithMessage("Completed date is required.")
            .LessThanOrEqualTo(DateTime.UtcNow.AddMinutes(5))
            .WithMessage("Completed date cannot be in the future.");

        RuleFor(record => record.MileageAtService)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Mileage at service cannot be negative.");

        RuleFor(record => record.Cost)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Cost cannot be negative.");

        RuleFor(record => record.Notes)
            .MaximumLength(1000)
            .WithMessage("Notes cannot exceed 1000 characters.");
    }
}