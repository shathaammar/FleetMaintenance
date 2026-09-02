using FluentValidation;
using FleetMaintenance.Application.DTOs.MaintenanceRecords;

namespace FleetMaintenance.Application.Validators.MaintenanceRecords;

public class CreateMaintenanceRecordDtoValidator
    : AbstractValidator<CreateMaintenanceRecordDto>
{
    public CreateMaintenanceRecordDtoValidator()
    {
        RuleFor(record => record.VehicleId)
            .GreaterThan(0)
            .WithMessage("A valid vehicle ID is required.");

        RuleFor(record => record.MaintenanceTypeId)
            .GreaterThan(0)
            .WithMessage("A valid maintenance type ID is required.");

        RuleFor(record => record.ScheduledDate)
            .NotEmpty()
            .WithMessage("Scheduled date is required.")
            .Must(date =>
                date.Date >= DateTime.UtcNow.Date)
            .WithMessage(
                "Scheduled date cannot be in the past.");

        RuleFor(record => record.DueMileage)
            .GreaterThan(0)
            .When(record => record.DueMileage.HasValue)
            .WithMessage("Due mileage must be greater than zero.");

        RuleFor(record => record.Notes)
            .MaximumLength(1000)
            .WithMessage("Notes cannot exceed 1000 characters.");
    }
}