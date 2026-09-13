using FluentValidation;
using FleetMaintenance.Application.DTOs.Users;

namespace FleetMaintenance.Application.Validators.Users;

public class UserFilterDtoValidator
    : AbstractValidator<UserFilterDto>
{
    public UserFilterDtoValidator()
    {
        RuleFor(filter => filter.Search)
            .MaximumLength(100)
            .When(filter => filter.Search is not null)
            .WithMessage("Search cannot exceed 100 characters.");

        RuleFor(filter => filter.PageNumber)
            .GreaterThan(0)
            .WithMessage("Page number must be greater than zero.");

        RuleFor(filter => filter.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("Page size must be between 1 and 100.");
    }
}