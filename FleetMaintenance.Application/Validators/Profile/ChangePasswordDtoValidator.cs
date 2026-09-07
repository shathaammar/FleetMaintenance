using FleetMaintenance.Application.DTOs.Profile;
using FluentValidation;

namespace FleetMaintenance.Application.Validators.Profile;

public class ChangePasswordDtoValidator
    : AbstractValidator<ChangePasswordDto>
{
    public ChangePasswordDtoValidator()
    {
        RuleFor(dto => dto.CurrentPassword)
            .NotEmpty()
            .WithMessage(
                "Current password is required.");

        RuleFor(dto => dto.NewPassword)
            .NotEmpty()
            .WithMessage(
                "New password is required.")
            .MinimumLength(8)
            .WithMessage(
                "New password must contain at least 8 characters.")
            .Matches("[A-Z]")
            .WithMessage(
                "New password must contain an uppercase letter.")
            .Matches("[a-z]")
            .WithMessage(
                "New password must contain a lowercase letter.")
            .Matches("[0-9]")
            .WithMessage(
                "New password must contain a number.")
            .NotEqual(dto =>
                dto.CurrentPassword)
            .WithMessage(
                "New password must be different from the current password.");

        RuleFor(dto =>
                dto.ConfirmNewPassword)
            .NotEmpty()
            .WithMessage(
                "Password confirmation is required.")
            .Equal(dto =>
                dto.NewPassword)
            .WithMessage(
                "New passwords do not match.");
    }
}