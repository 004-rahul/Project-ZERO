# ADR-016 — SQL-script schema ownership with a DbUp-based migrator

| | |
|---|---|
| **Status** | Accepted |
| **Date** | Reconstructed 2026-08-15 (decision predates this record) |
| **Deciders** | Founders / Engineering Lead |
| **Related** | ADR-05 (PostgreSQL), ADR-17 (two-lane data access); *Architecture Bible* §17; *Engineering Playbook* §12; *Sprint Plan* §5 (Sprint 3); *Developer Guide* §3.4 |

> **Record provenance.** This decision was cited as binding by the *Sprint Plan*
> (Sprint 3 scope) and the *Developer Guide* (§3.4) but had no written record —
> the `docs/adr/` folder did not exist. This document reconstructs the decision
> faithfully from those two descriptions. **The decision itself is unchanged;
> only the reasoning and consequences are newly written down.** If any detail
> here misstates the original intent, correct it — it was reconstructed, not
> witnessed.

---

## Context

The platform needs a schema evolution mechanism that satisfies three constraints
already fixed by other decisions:

1. **PostgreSQL is the one engine everywhere** (ADR-05) — dev, staging, and
   production run the same database, so migrations cannot rely on
   provider-specific tooling shims.
2. **Every migration needs a tested rollback path** (*Engineering Playbook* §12:
   "a migration without a tested down-path or documented forward-fix is
   incomplete").
3. **Data access is deliberately two-lane** (ADR-17): EF Core for simple reads,
   Dapper/stored procedures for bulk work. A schema owned by EF Core migrations
   would make the ORM the authority over a schema that half the data access
   layer bypasses.

EF Core migrations were the obvious default and were rejected. They generate
schema from C# model state, which makes the *model* the source of truth; that is
wrong here because stored procedures, indexes tuned by hand, and bulk-path SQL
are first-class parts of this schema and have no C# representation. Generated
migrations also produce diffs that are hard to review, and their down-migrations
are frequently wrong in ways nobody discovers until a rollback is attempted
under pressure.

## Decision

**The database schema is owned by hand-written SQL scripts, applied by a
dedicated DbUp-based migrator.**

| Element | Specification |
|---|---|
| Script location | `backend/db/migrations/` |
| Naming | `V{NNNN}__{description}.sql` — zero-padded, strictly ordered |
| Style | `CREATE` then `ALTER`; never edit an applied script |
| Runner | `ProjectZero.Database.Migrator` (DbUp), a standalone executable |
| Journal | `schema_versions` table — records which scripts have been applied |
| Rollback | **One rollback script per migration**, in `backend/db/rollbacks/` |
| Seed data | `backend/db/seed/` — separate from schema, environment-scoped |
| CI gate | **Drift check** — CI compares the script-built schema against the EF Core entity configurations and fails on divergence |

The drift check is what makes the two-lane approach safe: EF Core still has
entity configurations (it must, to query), but they *describe* a schema they do
not *own*. CI proves the description stays true.

## Consequences

### Positive

- **The schema is reviewable.** A migration is SQL a reviewer can read and reason
  about, not a generated artifact.
- **Rollback is real, not theoretical.** Every migration ships with an explicit
  down-path that can be tested (*Engineering Playbook* §12 requirement satisfied
  structurally).
- **Stored procedures, indexes, and constraints are first-class** — they live in
  the same versioned pipeline as tables, which the ORM-generated approach cannot
  offer.
- **The migrator is deployable independently** of the API, so schema changes can
  be applied in a controlled step of the release process rather than at app
  startup.
- **Tenant columns are enforceable at the schema level.** `organization_id` /
  `workspace_id` being non-null and indexed on every tenant table (ADR-10) is
  expressed directly in DDL a reviewer can check.

### Negative — accepted

- **More manual work per change.** Adding a column means writing the script and
  its rollback, and updating the EF configuration. This is deliberate friction;
  the drift check catches the case where someone updates one and not the other.
- **No automatic model-to-schema scaffolding.** Mitigated by keeping the Platform
  module as a worked example to copy (*Developer Guide* §7).
- **Script ordering is a merge-conflict surface** when two branches add
  migrations concurrently. Resolution rule: renumber on rebase, never reuse a
  number that has been applied anywhere.

### Neutral

- DbUp is a thin library, not a framework; replacing it later would not require
  changing a single migration script.

## Compliance

Per *Architecture Bible* §39: module boundaries preserved (each module owns its
own scripts); provider abstraction unaffected (the schema is not a provider);
**tenant isolation strengthened** — tenant keys are enforced in DDL; security
standards followed (no credentials in scripts); observability — the migrator
logs every applied script to the journal and to structured logs.

## Follow-up actions

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Confirm this reconstruction matches original intent | Founders | Before Sprint 3 |
| 2 | Build `ProjectZero.Database.Migrator` with the journal and drift check | Engineering | Sprint 3 |
| 3 | Add the drift check as a blocking CI stage | Engineering | Sprint 3 |
