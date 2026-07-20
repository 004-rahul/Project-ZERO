namespace ProjectZero.BuildingBlocks.Web.Middleware;

/// <summary>
/// The one error envelope used by every API in the platform
/// (Architecture Bible §30: standard error responses).
/// </summary>
public sealed record ApiErrorResponse(
    string Code,
    string Message,
    string CorrelationId,
    string? Detail = null);
