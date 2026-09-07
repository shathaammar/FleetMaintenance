using FleetMaintenance.Application.DTOs.Profile;
using FluentValidation;

namespace FleetMaintenance.Application.Validators.Profile;

public class UpdateProfileDtoValidator
    : AbstractValidator<UpdateProfileDto>
{
    public UpdateProfileDtoValidator()
    {
        RuleFor(dto => dto)
            .Must(HaveAtLeastOneValue)
            .WithMessage(
                "At least one field must be provided.");

        RuleFor(dto => dto.FullName)
            .NotEmpty()
            .WithMessage(
                "Full name cannot be empty.")
            .MaximumLength(100)
            .WithMessage(
                "Full name cannot exceed 100 characters.")
            .When(dto =>
                dto.FullName is not null);

        RuleFor(dto => dto.PhoneNumber)
            .Matches(@"^\+?[1-9]\d{7,14}$")
            .WithMessage(
                "Phone number must be a valid international number, for example +962791234567.")
            .When(dto =>
                !string.IsNullOrWhiteSpace(
                    dto.PhoneNumber));
    }

    private static bool HaveAtLeastOneValue(UpdateProfileDto dto)
    {
        return dto.FullName is not null ||
               dto.PhoneNumber is not null;
    }
}