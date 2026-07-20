using System.Reflection;

namespace ProjectZero.Modules.Platform.Application;

/// <summary>
/// Assembly marker used by architecture tests and assembly scanning.
/// </summary>
public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}
