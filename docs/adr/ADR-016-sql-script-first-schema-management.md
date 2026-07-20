# ADR-016 — SQL-script-first database schema management

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-07-20 |
| **Deciders** | Founder |

## Context

The platform needs a schema-change strategy before the first entities land
(Identity, Sprint 4). Options considered: EF Core code-first migrations,
database-first scaffolding, and SQL-script-first (versioned `CREATE`/`ALTER`
scripts executed in order). The founder's direct experience across multiple
production projects is with the SQL-script-first model, which keeps the
schema explicit, DBA-reviewable, and independent of ORM tooling.

## Decision

**The database schema is owned by versioned SQL script files, executed in
order by a migration runner** — not by EF Core migrations and not scaffolded
database-first.

1. **Scripts live in** `backend/db/migrations/`, ordered by version prefix:
   `V0001__identity_create_users.sql`, `V0002__identity_create_sessions.sql`,
   `V0014__identity_alter_users_add_mfa_columns.sql`, …
2. **Naming convention:** `V{NNNN}__{module}_{action}_{object}.sql` —
   the module name keeps per-module ownership visible in one global order.
3. **Run-once journal:** the runner records every applied script in a
   `schema_versions` table; a script, once applied, is **immutable** — schema
   changes are always a *new* `ALTER` script, never an edit to an old file.
4. **Rollback pairs:** every script has a companion in
   `backend/db/rollbacks/` (`R0001__…`) or a documented forward-fix note —
   the Engineering Playbook §12 rule (no migration without a tested down-path)
   applies unchanged.
5. **Runner:** a DbUp-based console project (`ProjectZero.Database.Migrator`)
   executes pending scripts against a target connection string; CI runs it
   against a disposable PostgreSQL before tests; deployments run it as a
   pipeline step. Built in **Sprint 3** with the tenancy foundation.
6. **Seed/reference data:** separate ordered scripts under `backend/db/seed/`,
   environment-aware, never mixed with schema scripts.

## Division of responsibility (important)

- **Schema:** SQL scripts (this ADR).
- **Data access:** EF Core mapped onto the script-defined schema
  (`IEntityTypeConfiguration` per entity, **no** EF migrations) — retained
  because ADR-10's tenant isolation is enforced through EF Core **global query
  filters**, which make an unfiltered tenant query impossible by default.
  Entity configurations must match the scripts; a CI schema-compatibility test
  (model validates against a database built purely from scripts) guards drift.
  **How EF vs. SQL/SPs is split is defined in ADR-017** — EF for simple reads,
  stored procedures / parameterized SQL for bulk operations.

## Consequences

- Full control and reviewability of every DDL statement; PostgreSQL-specific
  features (FTS, pgvector) are first-class, not workarounds.
- The team must maintain entity-configuration ↔ script agreement by hand; the
  CI drift check exists precisely because this is the pattern's known cost.
- `dotnet ef migrations` is **not used anywhere**; introducing it later would
  require superseding this ADR.
