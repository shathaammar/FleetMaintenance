using FleetMaintenance.Application.DTOs.MaintenanceRequests;
using FluentValidation;

namespace FleetMaintenance.Application.Validators.MaintenanceRequests;

public class ApproveMaintenanceRequestDtoValidator
    : AbstractValidator<ApproveMaintenanceRequestDto>
{
    public ApproveMaintenanceRequestDtoValidator()
    {
        RuleFor(dto => dto.ScheduledDate)
            .NotEmpty()
            .WithMessage("Scheduled date is required.")
            .Must(date =>
                date.Date >= DateTime.UtcNow.Date)
            .WithMessage(
                "Scheduled date cannot be in the past.");

        RuleFor(dto => dto.DueMileage)
            .GreaterThan(0)
            .When(dto => dto.DueMileage.HasValue)
            .WithMessage(
                "Due mileage must be greater than zero.");

        RuleFor(dto => dto.Notes)
            .MaximumLength(1000)
            .When(dto => !string.IsNullOrWhiteSpace(dto.Notes))
            .WithMessage(
                "Notes cannot exceed 1000 characters.");
    }
}