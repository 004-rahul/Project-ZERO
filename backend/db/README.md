# Project Zero — Database Scripts (ADR-016)

The schema is owned by **versioned SQL scripts in this folder** — not by ORM
migrations. Once a script has been applied anywhere, it is immutable: every
change is a new `ALTER` script with the next version number.

```
db/
├── migrations/   # V{NNNN}__{module}_{action}_{object}.sql — applied in order, once
├── rollbacks/    # R{NNNN}__... — tested down-path per migration (Playbook §12)
└── seed/         # ordered, environment-aware reference/seed data
```

## Naming convention

```
V0001__identity_create_users.sql
V0002__identity_create_refresh_tokens.sql
V0003__organizations_create_organizations.sql
V0014__identity_alter_users_add_mfa_columns.sql
```

- `V{NNNN}` — global order, zero-padded, never reused.
- `{module}` — owning module (identity, organizations, workspaces, aigateway,
  connectors, knowledge, decisions, billing, admin, notifications).
- Applied scripts are journaled in the `schema_versions` table by the runner.

## Rules (binding)

1. **Never edit an applied script** — write a new `ALTER` script.
2. **Every tenant-scoped table carries `organization_id` and `workspace_id`**,
   non-null where applicable, indexed (ADR-10 — reviewed as severity-1 in PRs).
3. Every migration ships with its rollback script or a documented forward-fix.
4. A module's tables are touched only by that module's scripts
   (module data ownership — Architecture Bible §9.3).
5. EF Core entity configurations must match these scripts; the CI drift check
   (schema built from scripts vs. mapped model) is a release gate.

## Runner

`ProjectZero.Database.Migrator` (DbUp-based console, **built in Sprint 3**):
executes pending scripts in order against the target connection string —
locally, in CI against disposable PostgreSQL, and as a deployment step.

First real scripts land with **Epic 1 (Identity, Sprint 4)**.

## Data access on top of this schema (ADR-017)

- **EF Core (LINQ)** — simple, low-volume reads and single-entity CRUD.
- **Stored procedures / parameterized inline SQL (Dapper)** — bulk and heavy
  operations. Stored procedures are created/altered through the `migrations/`
  scripts here (never edited live).
- **Every raw statement is parameterized** (no string concatenation) and, on
  tenant-scoped tables, **must filter on `@organization_id` / `@workspace_id`** —
  EF global query filters do not apply to raw SQL.
