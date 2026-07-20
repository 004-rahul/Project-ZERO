using System.Reflection;
using NetArchTest.Rules;
using Xunit;

namespace ProjectZero.ArchitectureTests;

/// <summary>
/// Enforces the Clean Architecture dependency rule in CI
/// (Architecture Bible §8.2: dependencies point inward only). These tests are
/// a permanent release gate — a violating merge fails the pipeline.
/// </summary>
public class LayerDependencyTests
{
    private static readonly Assembly DomainAssembly =
        Modules.Platform.Domain.AssemblyReference.Assembly;

    private static readonly Assembly ApplicationAssembly =
        Modules.Platform.Application.AssemblyReference.Assembly;

    [Fact]
    public void DomainLayer_MustNotDependOn_OuterLayers()
    {
        var result = Types.InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOnAny(
                "ProjectZero.Modules.Platform.Application",
                "ProjectZero.Modules.Platform.Infrastructure",
                "ProjectZero.Modules.Platform.Presentation",
                "Microsoft.AspNetCore",
                "Microsoft.EntityFrameworkCore")
            .GetResult();

        Assert.True(result.IsSuccessful, FailureReport("Domain", result));
    }

    [Fact]
    public void ApplicationLayer_MustNotDependOn_InfrastructureOrPresentation()
    {
        var result = Types.InAssembly(ApplicationAssembly)
            .ShouldNot()
            .HaveDependencyOnAny(
                "ProjectZero.Modules.Platform.Infrastructure",
                "ProjectZero.Modules.Platform.Presentation",
                "Microsoft.AspNetCore")
            .GetResult();

        Assert.True(result.IsSuccessful, FailureReport("Application", result));
    }

    [Fact]
    public void DomainLayer_MustNotDependOn_VendorSdks()
    {
        // Provider abstraction rule (Architecture Bible §12.3): no vendor types
        // in business logic, ever.
        var result = Types.InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOnAny(
                "OpenAI",
                "Azure",
                "Anthropic",
                "Npgsql",
                "StackExchange.Redis",
                "RabbitMQ.Client")
            .GetResult();

        Assert.True(result.IsSuccessful, FailureReport("Domain (vendor rule)", result));
    }

    private static string FailureReport(string layer, TestResult result)
    {
        if (result.IsSuccessful)
        {
            return string.Empty;
        }

        var offenders = result.FailingTypeNames is null
            ? "unknown types"
            : string.Join(", ", result.FailingTypeNames);

        return $"{layer} layer violates the dependency rule. Offending types: {offenders}";
    }
}
