using FleetMaintenance.Application.Common.Models;
using FluentValidation.Results;

namespace FleetMaintenance.Application.Common.Extensions;

public static class ValidationResultExtensions
{
    public static ApiResponse<object> ToApiResponse(
        this ValidationResult validationResult)
    {
        var errors = validationResult.Errors
            .GroupBy(error => error.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Select(error => error.ErrorMessage)
                    .ToArray());

        return new ApiResponse<object>
        {
            Success = false,
            Message = "Validation failed.",
            Data = errors
        };
    }
}