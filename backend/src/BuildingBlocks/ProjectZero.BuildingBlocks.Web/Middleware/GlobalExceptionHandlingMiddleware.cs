using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ProjectZero.BuildingBlocks.Web.Middleware;

/// <summary>
/// Last line of defense: no unhandled exception ever reaches a client raw
/// (Architecture Bible §30). Failures are logged with the correlation id and
/// answered with the standard error envelope; exception detail is exposed only
/// in the Development environment.
/// </summary>
public sealed class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public GlobalExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionHandlingMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            string correlationId = context.Items[CorrelationIdMiddleware.ItemName] as string ?? "unknown";

            _logger.LogError(
                exception,
                "Unhandled exception for {Method} {Path} (correlation {CorrelationId})",
                context.Request.Method,
                context.Request.Path,
                correlationId);

            if (context.Response.HasStarted)
            {
                throw;
            }

            context.Response.Clear();
            context.Response.Headers[CorrelationIdMiddleware.HeaderName] = correlationId;
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var envelope = new ApiErrorResponse(
                Code: "internal_error",
                Message: "An unexpected error occurred. The incident has been logged.",
                CorrelationId: correlationId,
                Detail: _environment.IsDevelopment() ? exception.ToString() : null);

            await context.Response.WriteAsJsonAsync(envelope);
        }
    }
}
