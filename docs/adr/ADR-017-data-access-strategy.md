# ADR-017 — Data access strategy (EF Core for simple reads; SPs / parameterized SQL for the rest)

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-07-20 |
| **Deciders** | Founder |
| **Related** | ADR-010 (row-level tenant isolation), ADR-016 (SQL-script-first schema) |

## Context

ADR-016 established that the schema is owned by SQL scripts and that EF Core is
used for data access only. This ADR narrows *how* EF Core is used. The founder's
requirement, from experience on prior production systems: keep the ORM on the
simple path only, and use explicit SQL for anything heavy — for predictable
performance and full control of the executed statement.

## Decision

Data access follows a **two-lane policy**:

**Lane 1 — EF Core (LINQ):** simple, low-volume reads and single-entity
`add / update / delete` where the ORM's change tracking and query filters add
safety with negligible cost. This is the default for ordinary CRUD on one
aggregate.

**Lane 2 — Stored procedures or parameterized inline SQL (via Dapper):** all
**bulk** or **heavy** operations — set-based inserts/updates/deletes, multi-row
reporting reads, joins across large tables, and anything performance-sensitive.
Executed through the same module repository interfaces so callers do not know
which lane served them.

### Non-negotiable rules

1. **SQL injection is designed out.** Every statement — SP call or inline — uses
   **parameters only**. String concatenation or interpolation of user input into
   SQL is a critical, review-blocking defect. Inline SQL uses Dapper parameter
   objects; SPs receive typed parameters. No exceptions.
2. **Tenant scope is explicit in Lane 2.** EF Core global query filters (ADR-010)
   do **not** apply to raw SQL or SPs. Therefore every SP and inline query that
   touches a tenant-scoped table **must accept `@organization_id` /
   `@workspace_id` parameters and filter on them.** A raw query without tenant
   scope on tenant data is a severity-1 defect — the same bar as a missing EF
   filter. The tenant-isolation test suite (Sprint 6+) exercises the raw-SQL
   paths as well as the EF paths.
3. **Repositories own the boundary.** SPs and inline SQL live behind the module's
   Infrastructure-layer repository classes. Application and Domain layers see
   interfaces only and never see SQL text (Clean Architecture — Architecture
   Bible §8).
4. **SPs are versioned scripts too.** Stored procedures are created and altered
   through the `backend/db/migrations/` scripts (ADR-016), never edited live in
   the database. `CREATE OR REPLACE FUNCTION` / procedure definitions are
   ordinary versioned migrations.
5. **Reads that cross modules go through contracts/events, not shared SQL** — a
   module's SQL touches only that module's tables (Architecture Bible §9.3).

## Consequences

- Hot paths get hand-tuned SQL/SPs; ordinary CRUD stays terse and safe in EF.
- The cost is discipline: Lane 2 loses the automatic tenant filter, so reviewers
  and the isolation test suite must confirm explicit tenant parameters on every
  raw statement. Rule 2 exists precisely because this is the pattern's sharp edge.
- Dapper is added as the Lane-2 execution library when the first repositories are
  built (Identity, Sprint 4). Until then this ADR is the standing policy.
