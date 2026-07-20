using Microsoft.AspNetCore.Http;
using ProjectZero.BuildingBlocks.Web.Middleware;
using Xunit;

namespace ProjectZero.UnitTests.Middleware;

public class CorrelationIdMiddlewareTests
{
    [Fact]
    public async Task ShouldGenerateCorrelationId_WhenNoneProvided()
    {
        var context = new DefaultHttpContext();
        var middleware = new CorrelationIdMiddleware(_ => Task.CompletedTask);

        await middleware.InvokeAsync(context);

        string? correlationId = context.Response.Headers[CorrelationIdMiddleware.HeaderName];
        Assert.False(string.IsNullOrWhiteSpace(correlationId));
        Assert.Equal(correlationId, context.Items[CorrelationIdMiddleware.ItemName]);
    }

    [Fact]
    public async Task ShouldHonorIncomingCorrelationId()
    {
        var context = new DefaultHttpContext();
        context.Request.Headers[CorrelationIdMiddleware.HeaderName] = "test-correlation-123";
        var middleware = new CorrelationIdMiddleware(_ => Task.CompletedTask);

        await middleware.InvokeAsync(context);

        Assert.Equal("test-correlation-123", (string?)context.Response.Headers[CorrelationIdMiddleware.HeaderName]);
        Assert.Equal("test-correlation-123", context.Items[CorrelationIdMiddleware.ItemName]);
    }
}
