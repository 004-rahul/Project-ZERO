namespace ProjectZero.Modules.Platform.Application.Info;

/// <summary>
/// Application-layer contract; the infrastructure layer supplies the implementation
/// (dependency rule — Architecture Bible §8.2).
/// </summary>
public interface IPlatformInfoProvider
{
    PlatformInfo GetPlatformInfo();
}
