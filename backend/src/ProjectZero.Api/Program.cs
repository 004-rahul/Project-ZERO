using ProjectZero.BuildingBlocks.Web.Middleware;
using ProjectZero.BuildingBlocks.Web.Modules;
using ProjectZero.Modules.Platform.Presentation;
using Serilog;

// Two-stage Serilog initialization: a bootstrap logger catches startup failures,
// then the configured logger takes over (Architecture Bible §29).
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting Project Zero API");

    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, loggerConfiguration) => loggerConfiguration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext());

    // ---- Modules (Architecture Bible §9: the host composes modules, never internals) ----
    IModule[] modules = [new PlatformModule()];

    foreach (IModule module in modules)
    {
        module.RegisterServices(builder.Services, builder.Configuration);
        Log.Information("Registered module {ModuleName}", module.Name);
    }

    // ---- Health checks: liveness is unconditional; readiness includes PostgreSQL
    //      when a connection string is configured (dev without Docker stays green). ----
    var healthChecks = builder.Services.AddHealthChecks();

    string? databaseConnectionString = builder.Configuration.GetConnectionString("Database");
    if (!string.IsNullOrWhiteSpace(databaseConnectionString))
    {
        healthChecks.AddNpgSql(databaseConnectionString, name: "postgres", tags: ["ready"]);
    }

    // ---- OpenAPI (Product Bible FR-23: documented APIs) ----
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var app = builder.Build();

    app.UseMiddleware<CorrelationIdMiddleware>();
    app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.MapHealthChecks("/health/live", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
    {
        Predicate = _ => false, // liveness: process is up, no dependencies checked
    });

    app.MapHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
    {
        Predicate = registration => registration.Tags.Contains("ready"),
    });

    // ---- Versioned API root: every module maps under /api/v1 (Architecture Bible §24) ----
    RouteGroupBuilder apiV1 = app.MapGroup("/api/v1");

    foreach (IModule module in modules)
    {
        module.MapEndpoints(apiV1);
    }

    app.Run();
}
catch (Exception exception)
{
    Log.Fatal(exception, "Project Zero API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

/// <summary>Exposed for WebApplicationFactory-based integration tests.</summary>
public partial class Program;
