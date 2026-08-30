using FluentValidation;
using FleetMaintenance.Application.DTOs.Auth;

namespace FleetMaintenance.Application.Validators.Auth;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(dto => dto.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .EmailAddress()
            .WithMessage("A valid email address is required.");

        RuleFor(dto => dto.Password)
            .NotEmpty()
            .WithMessage("Password is required.");
    }
}