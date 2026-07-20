using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using ProjectZero.BuildingBlocks.Web.Middleware;
using Xunit;

namespace ProjectZero.UnitTests.Middleware;

public class GlobalExceptionHandlingMiddlewareTests
{
    private sealed class FakeEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Production;
        public string ApplicationName { get; set; } = "ProjectZero.Tests";
        public string ContentRootPath { get; set; } = string.Empty;
        public Microsoft.Extensions.FileProviders.IFileProvider ContentRootFileProvider { get; set; } = null!;
    }

    [Fact]
    public async Task ShouldReturnStandardErrorEnvelope_WhenExceptionIsThrown()
    {
        var context = new DefaultHttpContext();
        context.Items[CorrelationIdMiddleware.ItemName] = "corr-42";
        context.Response.Body = new MemoryStream();

        var middleware = new GlobalExceptionHandlingMiddleware(
            _ => throw new InvalidOperationException("boom"),
            NullLogger<GlobalExceptionHandlingMiddleware>.Instance,
            new FakeEnvironment());

        await middleware.InvokeAsync(context);

        Assert.Equal(StatusCodes.Status500InternalServerError, context.Response.StatusCode);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var envelope = await JsonSerializer.DeserializeAsync<ApiErrorResponse>(
            context.Response.Body,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        Assert.NotNull(envelope);
        Assert.Equal("internal_error", envelope.Code);
        Assert.Equal("corr-42", envelope.CorrelationId);
        Assert.Null(envelope.Detail); // never leak exception detail outside Development
    }

    [Fact]
    public async Task ShouldIncludeDetail_OnlyInDevelopment()
    {
        var context = new DefaultHttpContext();
        context.Items[CorrelationIdMiddleware.ItemName] = "corr-dev";
        context.Response.Body = new MemoryStream();

        var middleware = new GlobalExceptionHandlingMiddleware(
            _ => throw new InvalidOperationException("boom"),
            NullLogger<GlobalExceptionHandlingMiddleware>.Instance,
            new FakeEnvironment { EnvironmentName = Environments.Development });

        await middleware.InvokeAsync(context);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var envelope = await JsonSerializer.DeserializeAsync<ApiErrorResponse>(
            context.Response.Body,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        Assert.NotNull(envelope);
        Assert.Contains("boom", envelope.Detail);
    }
}
