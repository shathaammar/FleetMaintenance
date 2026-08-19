using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.Common.Models;

namespace FleetMaintenance.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException exception)
        {
            await WriteErrorResponseAsync(
                context,
                StatusCodes.Status404NotFound,
                exception.Message);
        }
        catch (ConflictException exception)
        {
            await WriteErrorResponseAsync(
                context,
                StatusCodes.Status409Conflict,
                exception.Message);
        }
        catch (UnauthorizedException exception)
        {
            await WriteErrorResponseAsync(
                context,
                StatusCodes.Status401Unauthorized,
                exception.Message);
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "An unexpected error occurred.");

            await WriteErrorResponseAsync(
                context,
                StatusCodes.Status500InternalServerError,
                "An unexpected error occurred.");
        }
    }

    private static async Task WriteErrorResponseAsync(
        HttpContext context,
        int statusCode,
        string message)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var response = new ApiResponse<object>
        {
            Success = false,
            Message = message,
            Data = null
        };

        await context.Response.WriteAsJsonAsync(response);
    }
}