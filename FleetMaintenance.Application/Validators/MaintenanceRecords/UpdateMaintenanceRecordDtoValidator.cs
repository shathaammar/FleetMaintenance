using FluentValidation;
using FleetMaintenance.Application.DTOs.MaintenanceRecords;

namespace FleetMaintenance.Application.Validators.MaintenanceRecords;

public class UpdateMaintenanceRecordDtoValidator
    : AbstractValidator<UpdateMaintenanceRecordDto>
{
    public UpdateMaintenanceRecordDtoValidator()
    {
        RuleFor(record => record)
            .Must(HaveAtLeastOneValue)
            .WithMessage("At least one field must be provided.");

        RuleFor(record => record.MaintenanceTypeId)
            .GreaterThan(0)
            .When(record => record.MaintenanceTypeId.HasValue)
            .WithMessage("A valid maintenance type ID is required.");

        RuleFor(record => record.ScheduledDate)
            .NotEmpty()
            .WithMessage(
                "Scheduled date cannot be empty.")
            .Must(date =>
                !date.HasValue ||
                date.Value.Date >=
                    DateTime.UtcNow.Date)
            .WithMessage(
                "Scheduled date cannot be in the past.")
            .When(record =>
                record.ScheduledDate.HasValue);

        RuleFor(record => record.DueMileage)
            .GreaterThan(0)
            .When(record => record.DueMileage.HasValue)
            .WithMessage("Due mileage must be greater than zero.");

        RuleFor(record => record.Notes)
            .MaximumLength(1000)
            .When(record => record.Notes is not null)
            .WithMessage("Notes cannot exceed 1000 characters.");
    }

    private static bool HaveAtLeastOneValue(
        UpdateMaintenanceRecordDto dto)
    {
        return dto.MaintenanceTypeId.HasValue
            || dto.ScheduledDate.HasValue
            || dto.DueMileage.HasValue
            || dto.Notes is not null;
    }
}