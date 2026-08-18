using FluentValidation;
using FleetMaintenance.Application.DTOs.Vehicles;

namespace FleetMaintenance.Application.Validators.Vehicles;

public class VehicleFilterDtoValidator
    : AbstractValidator<VehicleFilterDto>
{
    public VehicleFilterDtoValidator()
    {
        RuleFor(filter => filter.Search)
            .MaximumLength(100)
            .When(filter => filter.Search is not null)
            .WithMessage("Search cannot exceed 100 characters.");

        RuleFor(filter => filter.Status)
            .IsInEnum()
            .When(filter => filter.Status.HasValue)
            .WithMessage("Invalid vehicle status.");

        RuleFor(filter => filter.PageNumber)
            .GreaterThan(0)
            .WithMessage("Page number must be greater than zero.");

        RuleFor(filter => filter.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("Page size must be between 1 and 100.");
    }
}