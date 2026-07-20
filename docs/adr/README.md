# Architecture Decision Records

Every significant architectural decision is documented **before implementation**
(Architecture Bible §39). Use `ADR-TEMPLATE.md`.

## Founding decisions (ADR-01 … ADR-15)

The fifteen founding ADRs are recorded canonically in the
[Architecture Bible §7](../master-documents/03_Project_Zero_Architecture_Bible_v3.0.md)
(Clean Architecture, DDD, modular monolith, .NET + Python polyglot split,
PostgreSQL, Redis, RabbitMQ, provider abstraction, JWT/OIDC, row-level tenant
isolation, internal REST contract, OpenRouter for development, cloud-native
deployment, PostgreSQL FTS before Elasticsearch, feature flags).

New ADRs start at **ADR-016** and live in this folder as individual files.

## Index

| ADR | Decision | Status |
|---|---|---|
| [ADR-016](ADR-016-sql-script-first-schema-management.md) | SQL-script-first database schema management (versioned `CREATE`/`ALTER` scripts + runner; EF Core for data access only, no EF migrations) | Accepted |
| [ADR-017](ADR-017-data-access-strategy.md) | Data access: EF Core for simple reads; stored procedures / parameterized SQL (Dapper) for bulk operations; explicit tenant scope + injection safety in raw SQL | Accepted |
