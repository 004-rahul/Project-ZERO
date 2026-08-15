# ADR-017 — Two-lane data access: EF Core for reads, Dapper/SPs for bulk

| | |
|---|---|
| **Status** | Accepted |
| **Date** | Reconstructed 2026-08-15 (decision predates this record) |
| **Deciders** | Founders / Engineering Lead |
| **Related** | ADR-05 (PostgreSQL), ADR-10 (row-level tenancy), ADR-16 (SQL-script schema); *Architecture Bible* §16, §17; *Developer Guide* §3.4; *Sprint Plan* §5 (Sprint 3) |

> **Record provenance.** Cited as binding by the *Sprint Plan* (Sprint 3) and the
> *Developer Guide* (§3.4) but never written down. Reconstructed faithfully from
> those descriptions. **The decision is unchanged; the reasoning and
> consequences are newly recorded.** Correct anything that misstates the
> original intent.

---

## Context

Project Zero's data access has two workloads with genuinely different shapes:

- **Transactional business operations** — load an organization, update a
  workspace, read a user's roles. Small object graphs, rich domain mapping,
  heavy benefit from change tracking and compile-time safety.
- **Bulk and analytical work** — ingesting thousands of GitHub entities per sync,
  writing chunk and embedding rows, metering aggregation across a workspace,
  audit-log queries over large ranges. Set-based, latency-sensitive, and badly
  served by per-row ORM materialisation.

Using an ORM for both means bulk paths fight the ORM. Using raw SQL for both
throws away mapping and safety on the 80% of code that does not need the
performance.

The tenancy design (ADR-10) sharpens the risk: **global query filters** make an
unfiltered tenant query impossible *in EF Core*. Raw SQL bypasses that
protection entirely, which means a second lane cannot be adopted casually — it
needs an explicit rule.

## Decision

**Two lanes, with an explicit rule for when each applies.**

| Lane | Technology | Use for |
|---|---|---|
| **Lane 1 — default** | **EF Core** | Simple reads, single-entity CRUD, domain-object loading, anything inside a use case's transactional boundary |
| **Lane 2 — by exception** | **Stored procedures / parameterized Dapper SQL** | Bulk insert and update, set-based aggregation, reporting and metering queries, any path where profiling shows ORM materialisation dominates |

**Lane 1 is the default. Lane 2 requires a stated reason** — typically a measured
one (*Engineering Playbook* §14: "profile before optimizing").

### The binding safety rules for Lane 2

1. **Always parameterized.** String-concatenated SQL is a review-blocking defect,
   without exception.
2. **Always explicitly tenant-scoped.** Every raw statement against a tenant
   table must filter on `organization_id` / `workspace_id` **in the SQL itself**.
   EF Core's global filters do not apply here, so the protection that is
   automatic in Lane 1 is manual in Lane 2 — and a missing tenant scope is a
   critical defect (*Engineering Playbook* §5).
3. **Covered by the isolation suite.** Lane 2 paths are included in the permanent
   cross-tenant test suite (*Engineering Playbook* §10.1); a raw-SQL path that is
   not exercised by that suite is incomplete.
4. **Schema ownership stays with the scripts** (ADR-16). Stored procedures are
   versioned migrations like everything else.

## Consequences

### Positive

- **Each workload uses the right tool** — domain code stays expressive; bulk
  paths stay fast.
- **The ingestion pipeline is viable.** Sprint 14's embedding and chunk writes
  are exactly the workload an ORM handles worst.
- **No ORM-fighting patterns** (detached graphs, `AsNoTracking` everywhere,
  batching hacks) leaking into domain code.

### Negative — accepted, with mitigation

1. **Tenant isolation protection is asymmetric.** This is the real cost: Lane 1 is
   safe by construction, Lane 2 is safe by discipline. **Mitigation is
   mandatory and threefold** — the explicit-scope rule above, inclusion in the
   permanent isolation suite, and tenant-scope being the *first* thing a
   reviewer checks (*Engineering Playbook* §9, severity-ordered review).
2. **Two mental models** for contributors to hold. Mitigated by the default being
   unambiguous: reach for Lane 2 only with a reason.
3. **SQL duplicated across lanes** in a few places (an entity readable both ways).
   Accepted; the drift check (ADR-16) keeps the schema honest underneath both.

### Neutral

- Both lanes sit behind repository interfaces in the Application layer, so the
  choice is an Infrastructure implementation detail and never leaks into domain
  or use-case code.

## Compliance

Per *Architecture Bible* §39: module boundaries preserved (a module's repositories
serve only that module's data); provider abstraction unaffected; **tenant
isolation — the highest-consequence invariant — required explicit mitigation and
has it** (three named controls above); security standards followed
(parameterization mandatory); observability — both lanes emit query timing to
the metrics pipeline (§29).

## Follow-up actions

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Confirm this reconstruction matches original intent | Founders | Before Sprint 3 |
| 2 | Add a static-analysis rule flagging non-parameterized SQL | Engineering | Sprint 3 |
| 3 | Ensure the isolation suite covers every Lane 2 path as it is added | QA | Ongoing from Sprint 6 |
