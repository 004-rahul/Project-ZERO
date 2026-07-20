using System.Reflection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using ProjectZero.Modules.Platform.Application.Info;
using ProjectZero.Modules.Platform.Application.Options;

namespace ProjectZero.Modules.Platform.Infrastructure.Info;

/// <summary>
/// Supplies the platform's diagnostic identity from the host environment and
/// assembly metadata.
/// </summary>
public sealed class PlatformInfoProvider : IPlatformInfoProvider
{
    private static readonly DateTime StartedAtUtc = DateTime.UtcNow;

    private readonly IHostEnvironment _environment;
    private readonly IOptions<PlatformOptions> _options;

    public PlatformInfoProvider(IHostEnvironment environment, IOptions<PlatformOptions> options)
    {
        _environment = environment;
        _options = options;
    }

    public PlatformInfo GetPlatformInfo()
    {
        string version = Assembly.GetEntryAssembly()?
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?
            .InformationalVersion ?? "0.0.0";

        return new PlatformInfo(
            ServiceName: _options.Value.ServiceName,
            Version: version,
            Environment: _environment.EnvironmentName,
            StartedAtUtc: StartedAtUtc);
    }
}
