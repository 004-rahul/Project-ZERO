# Architecture Decision Records

Every significant architectural decision is recorded here before implementation
(*Architecture Bible* §39). The summary table of all ADRs lives in
[*Architecture Bible* §7](../master-documents/03_Project_Zero_Architecture_Bible_v3.0.md#7-architecture-decision-records-adrs);
this folder holds the full records — context, alternatives, consequences.

## Index

| ADR | Decision | Status | Record |
|---|---|---|---|
| 01–15 | Foundational decisions (Clean Architecture, DDD, modular monolith, polyglot split, PostgreSQL, Redis, RabbitMQ, provider abstraction, JWT, row-level tenancy, internal REST, OpenRouter, cloud-native, PG full-text, feature flags) | Accepted | Summarised in *Architecture Bible* §7 — standalone records not yet extracted |
| 16 | SQL-script schema ownership with a DbUp-based migrator | Accepted | [ADR-016](ADR-016-sql-script-schema-ownership.md) — *reconstructed; awaiting founder confirmation* |
| 17 | Two-lane data access: EF Core + Dapper | Accepted | [ADR-017](ADR-017-two-lane-data-access.md) — *reconstructed; awaiting founder confirmation* |
| 18 | React (Vite) client-rendered SPA for the frontend | Accepted | [ADR-018](ADR-018-react-spa-frontend.md) |
| 19 | `IConnector` implemented primarily as a Model Context Protocol host | Accepted | [ADR-019](ADR-019-mcp-host-connectors.md) |
| 20 | AI pipeline — retrieval quality and cost control as one decision | Accepted | [ADR-020](ADR-020-ai-pipeline-retrieval-and-cost.md) |
| 21 | Deferred infrastructure — no containers, cache server, or broker at the start | Accepted | [ADR-021](ADR-021-deferred-infrastructure.md) |

## Writing a new ADR

Copy the structure of [ADR-018](ADR-018-react-spa-frontend.md): context (why a
decision is needed), decision (what was chosen, and what was rejected),
consequences (positive, negative-with-mitigation, neutral), compliance against
the six §39 governance rules, and follow-up actions with owners.

Add a summary row to *Architecture Bible* §7 **in the same PR** — the table and
this folder must never disagree.
