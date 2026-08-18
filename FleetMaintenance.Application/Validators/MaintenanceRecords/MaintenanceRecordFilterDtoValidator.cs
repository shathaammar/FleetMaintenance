using FluentValidation;
using FleetMaintenance.Application.DTOs.MaintenanceRecords;

namespace FleetMaintenance.Application.Validators.MaintenanceRecords;

public class MaintenanceRecordFilterDtoValidator
    : AbstractValidator<MaintenanceRecordFilterDto>
{
    public MaintenanceRecordFilterDtoValidator()
    {
        RuleFor(filter => filter.Search)
            .MaximumLength(100)
            .When(filter => filter.Search is not null)
            .WithMessage("Search cannot exceed 100 characters.");

        RuleFor(filter => filter.VehicleId)
            .GreaterThan(0)
            .When(filter => filter.VehicleId.HasValue)
            .WithMessage("Invalid vehicle ID.");

        RuleFor(filter => filter.MaintenanceTypeId)
            .GreaterThan(0)
            .When(filter => filter.MaintenanceTypeId.HasValue)
            .WithMessage("Invalid maintenance type ID.");

        RuleFor(filter => filter.Status)
            .IsInEnum()
            .When(filter => filter.Status.HasValue)
            .WithMessage("Invalid maintenance status.");

        RuleFor(filter => filter.PageNumber)
            .GreaterThan(0)
            .WithMessage("Page number must be greater than zero.");

        RuleFor(filter => filter.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("Page size must be between 1 and 100.");

        RuleFor(filter => filter)
            .Must(HaveValidDateRange)
            .WithMessage(
                "To date must be greater than or equal to from date.");
    }

    private static bool HaveValidDateRange(
        MaintenanceRecordFilterDto filter)
    {
        if (!filter.FromDate.HasValue ||
            !filter.ToDate.HasValue)
        {
            return true;
        }

        return filter.ToDate.Value >= filter.FromDate.Value;
    }
}