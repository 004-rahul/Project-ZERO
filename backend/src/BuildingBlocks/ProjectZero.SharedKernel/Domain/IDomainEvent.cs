namespace ProjectZero.SharedKernel.Domain;

/// <summary>
/// A fact that happened in the domain. Events carry tenant context and a versioned
/// schema when published across modules (Architecture Bible §27).
/// </summary>
public interface IDomainEvent
{
    Guid EventId { get; }

    DateTime OccurredOnUtc { get; }
}
