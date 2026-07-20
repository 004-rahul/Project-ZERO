using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace ProjectZero.Api.IntegrationTests;

/// <summary>
/// Test host for the API. Clears the database connection string so readiness
/// checks do not require a running PostgreSQL — dependency-backed integration
/// tests arrive with the containerized test infrastructure in later sprints.
/// </summary>
public class ProjectZeroApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:Database"] = string.Empty,
            });
        });
    }
}
