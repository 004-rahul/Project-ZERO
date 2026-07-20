namespace ProjectZero.Modules.Platform.Application.Info;

/// <summary>
/// Diagnostic identity of the running platform, exposed at /api/v1/platform/info.
/// </summary>
public sealed record PlatformInfo(
    string ServiceName,
    string Version,
    string Environment,
    DateTime StartedAtUtc);
