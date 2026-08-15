# ADR-021 — Deferred infrastructure: no containers, cache server, or broker at the start

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Founders |
| **Related** | ADR-06 (Redis), ADR-07 (RabbitMQ), ADR-13 (cloud-native/Docker), ADR-08 (provider abstraction); *Architecture Bible* §12, §18, §19, §34.3; *Engineering Playbook* §12 |

---

## Context

The architecture specifies Docker everywhere, Redis for caching, and RabbitMQ for messaging. All three are correct for the platform at scale and none is disputed as a destination.

At the current stage they are cost without benefit. The team is one engineer on Windows. Redis has no good native Windows build and RabbitMQ requires an Erlang runtime, so both effectively depend on Docker; Docker in turn adds a build-and-run layer between every code change and seeing it work. A cache is meaningless with a single application process, and a broker is meaningless at single-digit messages per minute.

The relevant question is not whether these belong in the architecture — they do — but whether adopting them before they are needed buys anything. It does not.

## Decision

**Defer containers, the cache server, and the message broker. Run native processes against a locally installed PostgreSQL.** Each deferred component is represented by its existing provider interface with a simple implementation behind it.

| Component | Early implementation | Reinstated when |
|---|---|---|
| Cache | In-process memory cache behind `ICacheProvider` | A second application instance exists |
| Queue | PostgreSQL table polled by a .NET `BackgroundService` behind `IQueueProvider` | Queue depth or throughput demonstrably hurts |
| Vector store | `pgvector` in the primary PostgreSQL behind `IVectorStoreProvider` | Corpus scale demands a dedicated engine |
| Containers | None — native processes | First paying customer |
| Kubernetes | None | Staging environment (§34.1) |

**This is legal under this architecture, not an exception to it.** Every deferred component already sits behind a provider interface (ADR-08, §12). Choosing a simple implementation behind an interface is exactly what the interface is for. Deferral would only be an architectural violation if business logic depended on the concrete technology — which §12 already prohibits.

### Three binding rules that keep containerisation a packaging job

1. **All configuration through environment variables.** No machine-specific paths, no hard-coded directories.
2. **Services address each other by configurable base URL.** Never a hard-coded `localhost`.
3. **Dockerfiles are written early and left unused.** Minutes of work; they prevent accidentally building something un-containerizable and reduce the later containerisation sprint to a day.

## Consequences

### Positive

- **Faster iteration.** No container build between a change and seeing it run — material for a solo developer measured in hours per week.
- **Fewer moving parts to debug.** Three processes and one database, all inspectable with familiar tools.
- **No Windows infrastructure friction**, which is otherwise a recurring tax with no payoff at this scale.
- **Provider abstraction gets exercised early and genuinely.** Two real implementations per interface from the start proves the abstraction rather than assuming it — and the conformance suite (§12.6) is what proves the swap will work.

### Negative — accepted, with mitigation

1. **Development diverges from production topology**, against the §34.1 principle of identical topology across environments. Mitigated by rules 1–3 and by the deferral being explicitly time-boxed to the triggers above.
2. **The swap must eventually be exercised, not assumed.** The provider conformance suite runs against every implementation of each interface, so the Redis and RabbitMQ implementations are proven the moment they exist — before they carry load.
3. **A Postgres-backed queue is less capable** than a real broker: no native dead-letter semantics, no routing topology. Acceptable at this volume; the queue table must still implement retry with back-off, an attempt counter, and a poison-message state so the *behaviour* the architecture requires (§19, §30) exists regardless of transport.

### Non-negotiable — what does not relax

**Isolation obligations are unchanged.** Tenant-prefixed cache keys (§18) apply to the in-memory cache exactly as they would to Redis. The queue table is tenant-scoped like every other table (§16.2). Deferring a *technology* never defers an *invariant* — and an in-memory cache without tenant prefixes is the same critical defect it would be in Redis.

## Compliance

Per §39: module boundaries preserved; **provider abstraction maintained — this decision is an expression of it, not an exception**; tenant isolation explicitly unchanged and restated above; security standards unaffected; observability preserved (queue depth and cache metrics are emitted regardless of implementation); documented before implementation. ✅

## Follow-up actions

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Postgres queue implementation with retry, attempt count, and poison state | Engineering | With first async work |
| 2 | Tenant-prefix enforcement in the in-memory cache provider | Engineering | With `ICacheProvider` |
| 3 | Dockerfiles written and committed unused | Engineering | Early foundation work |
| 4 | Redis and RabbitMQ implementations pass the conformance suite before carrying load | Engineering | At their triggers |
