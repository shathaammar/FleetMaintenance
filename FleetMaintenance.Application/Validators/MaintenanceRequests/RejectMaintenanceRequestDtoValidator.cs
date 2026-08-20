using FleetMaintenance.Application.DTOs.MaintenanceRequests;
using FluentValidation;

namespace FleetMaintenance.Application.Validators.MaintenanceRequests;

public class RejectMaintenanceRequestDtoValidator
    : AbstractValidator<RejectMaintenanceRequestDto>
{
    public RejectMaintenanceRequestDtoValidator()
    {
        RuleFor(dto => dto.Reason)
            .NotEmpty()
            .WithMessage("Rejection reason is required.")
            .MaximumLength(500)
            .WithMessage(
                "Rejection reason cannot exceed 500 characters.");
    }
}