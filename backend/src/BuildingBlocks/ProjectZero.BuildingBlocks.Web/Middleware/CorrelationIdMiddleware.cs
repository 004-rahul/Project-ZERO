using Microsoft.AspNetCore.Http;
using Serilog.Context;

namespace ProjectZero.BuildingBlocks.Web.Middleware;

/// <summary>
/// Ensures every request carries a correlation id: honors an incoming
/// X-Correlation-Id header or generates one, echoes it on the response, and
/// pushes it into the log context so every log line of the request is traceable
/// (Architecture Bible §29: correlation ids on every request).
/// </summary>
public sealed class CorrelationIdMiddleware
{
    public const string HeaderName = "X-Correlation-Id";
    public const string ItemName = "CorrelationId";

    private readonly RequestDelegate _next;

    public CorrelationIdMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        string correlationId = GetOrCreateCorrelationId(context);

        context.Items[ItemName] = correlationId;
        context.Response.Headers[HeaderName] = correlationId;

        using (LogContext.PushProperty(ItemName, correlationId))
        {
            await _next(context);
        }
    }

    private static string GetOrCreateCorrelationId(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue(HeaderName, out var incoming) &&
            !string.IsNullOrWhiteSpace(incoming.ToString()))
        {
            return incoming.ToString();
        }

        return Guid.NewGuid().ToString("N");
    }
}
