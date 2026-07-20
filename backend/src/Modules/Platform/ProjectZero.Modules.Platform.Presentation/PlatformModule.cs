using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectZero.BuildingBlocks.Web.Modules;
using ProjectZero.Modules.Platform.Application.Info;
using ProjectZero.Modules.Platform.Application.Options;
using ProjectZero.Modules.Platform.Infrastructure.Info;

namespace ProjectZero.Modules.Platform.Presentation;

/// <summary>
/// The Platform module: host-level identity and diagnostics. This module is the
/// exemplar of the module pattern every future module (Identity, Organizations,
/// AI Gateway, ...) follows: services registered here, endpoints mapped under
/// the versioned API root, internals never referenced by the host.
/// </summary>
public sealed class PlatformModule : IModule
{
    public string Name => "Platform";

    public void RegisterServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<PlatformOptions>()
            .Bind(configuration.GetSection(PlatformOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<IPlatformInfoProvider, PlatformInfoProvider>();
    }

    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/platform/info", (IPlatformInfoProvider provider) =>
                Results.Ok(provider.GetPlatformInfo()))
            .WithName("GetPlatformInfo")
            .WithTags(Name)
            .Produces<PlatformInfo>(StatusCodes.Status200OK);
    }
}
