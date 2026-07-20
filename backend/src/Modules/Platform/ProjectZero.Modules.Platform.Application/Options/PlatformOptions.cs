using System.ComponentModel.DataAnnotations;

namespace ProjectZero.Modules.Platform.Application.Options;

/// <summary>
/// Host-level configuration, bound from the "Platform" section and validated at
/// startup — misconfiguration fails fast instead of surfacing at request time.
/// </summary>
public sealed class PlatformOptions
{
    public const string SectionName = "Platform";

    [Required(AllowEmptyStrings = false)]
    public string ServiceName { get; init; } = string.Empty;
}
