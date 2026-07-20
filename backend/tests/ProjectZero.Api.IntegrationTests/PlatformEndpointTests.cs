using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace ProjectZero.Api.IntegrationTests;

public class PlatformEndpointTests : IClassFixture<ProjectZeroApiFactory>
{
    private readonly ProjectZeroApiFactory _factory;

    public PlatformEndpointTests(ProjectZeroApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task HealthLive_ShouldReturnHealthy()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/health/live");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task HealthReady_ShouldReturnHealthy_WithoutDatabaseConfigured()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/health/ready");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task PlatformInfo_ShouldReturnServiceIdentity()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/v1/platform/info");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var info = await response.Content.ReadFromJsonAsync<PlatformInfoContract>();
        Assert.NotNull(info);
        Assert.Equal("ProjectZero.Api", info.ServiceName);
        Assert.False(string.IsNullOrWhiteSpace(info.Version));
    }

    [Fact]
    public async Task EveryResponse_ShouldCarryACorrelationId()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/v1/platform/info");

        Assert.True(response.Headers.Contains("X-Correlation-Id"));
    }

    [Fact]
    public async Task IncomingCorrelationId_ShouldBeEchoed()
    {
        using var client = _factory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/platform/info");
        request.Headers.Add("X-Correlation-Id", "integration-test-77");

        var response = await client.SendAsync(request);

        Assert.Equal("integration-test-77", response.Headers.GetValues("X-Correlation-Id").Single());
    }

    private sealed record PlatformInfoContract(
        string ServiceName,
        string Version,
        string Environment,
        DateTime StartedAtUtc);
}
