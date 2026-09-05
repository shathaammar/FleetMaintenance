using FleetMaintenance.Application.DTOs.MaintenanceRequests;
using FluentValidation;

namespace FleetMaintenance.Application.Validators.MaintenanceRequests;

public class MaintenanceRequestFilterDtoValidator
    : AbstractValidator<MaintenanceRequestFilterDto>
{
    public MaintenanceRequestFilterDtoValidator()
    {
        RuleFor(filter => filter.Search)
            .MaximumLength(100)
            .When(filter =>
                !string.IsNullOrWhiteSpace(filter.Search))
            .WithMessage(
                "Search cannot exceed 100 characters.");

        RuleFor(filter => filter.Status)
            .IsInEnum()
            .When(filter =>
            filter.Status.HasValue)
            .WithMessage(
            "Invalid maintenance request status.");

        RuleFor(filter => filter.PageNumber)
            .GreaterThan(0)
            .WithMessage(
                "Page number must be greater than zero.");

        RuleFor(filter => filter.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage(
                "Page size must be between 1 and 100.");

        RuleFor(filter => filter)
            .Must(filter =>
                !filter.FromDate.HasValue ||
                !filter.ToDate.HasValue ||
                filter.FromDate.Value.Date <=
                    filter.ToDate.Value.Date)
            .WithMessage(
                "From date cannot be after to date.");
    }
}