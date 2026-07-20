namespace ProjectZero.SharedKernel.Results;

/// <summary>
/// A machine-readable failure: stable code plus human-readable message.
/// Error codes surface in the standard API error envelope (Architecture Bible §30).
/// </summary>
public sealed record Error(string Code, string Message)
{
    public static readonly Error None = new(string.Empty, string.Empty);

    public static Error NotFound(string resource) =>
        new("not_found", $"{resource} was not found.");

    public static Error Validation(string message) =>
        new("validation_failed", message);

    public static Error Conflict(string message) =>
        new("conflict", message);

    public static Error Unexpected(string message) =>
        new("unexpected_error", message);
}
