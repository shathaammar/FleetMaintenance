using FleetMaintenance.Application.Common.Authorization;
using FleetMaintenance.Application.DTOs.Users;
using FluentValidation;

namespace FleetMaintenance.Application.Validators.Users;

public class UpdateUserRoleDtoValidator
    : AbstractValidator<UpdateUserRoleDto>
{
    public UpdateUserRoleDtoValidator()
    {
        RuleFor(dto => dto.Role)
            .NotEmpty()
            .WithMessage("Role is required.")
            .Must(role => role == AppRoles.Admin || role == AppRoles.User)
            .WithMessage(
                $"Role must be either '{AppRoles.Admin}' or '{AppRoles.User}'.");
    }
}