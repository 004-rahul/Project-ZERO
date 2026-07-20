using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ProjectZero.BuildingBlocks.Web.Modules;

/// <summary>
/// The contract every platform module implements. The API host composes modules
/// through this interface only — it never references module internals
/// (Architecture Bible §9: module boundaries are governance-protected).
/// </summary>
public interface IModule
{
    /// <summary>Stable module name, used for logging and diagnostics.</summary>
    string Name { get; }

    /// <summary>Registers the module's services into the host container.</summary>
    void RegisterServices(IServiceCollection services, IConfiguration configuration);

    /// <summary>Maps the module's endpoints under the versioned API root (/api/v1).</summary>
    void MapEndpoints(IEndpointRouteBuilder endpoints);
}
