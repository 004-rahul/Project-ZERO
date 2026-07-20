using System.Reflection;

namespace ProjectZero.Modules.Platform.Domain;

/// <summary>
/// Assembly marker used by architecture tests and assembly scanning.
/// The Platform module's domain layer holds platform-level business rules as
/// they emerge; it must never reference other layers (Architecture Bible §8).
/// </summary>
public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}
