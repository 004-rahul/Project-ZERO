# Project Zero — Sprint Plan & Delivery Schedule

| | |
|---|---|
| **Document** | Project Zero Sprint Plan & Delivery Schedule |
| **Document Number** | 07 of 07 |
| **Version** | 1.0 |
| **Status** | Working Document — Updated Every Sprint |
| **Owner** | Founders / Engineering Lead |
| **Audience** | Everyone planning, building, or tracking delivery |
| **Derives From** | Roadmap & Implementation Guide v3.0 (phases, epics, milestones, dependency map), Product Bible v3.0 (scope and acceptance criteria), Architecture Bible v3.0 (Phase 0 scope, ADRs), Engineering Playbook v3.0 (Definition of Done, quality gates), Experience & Design Bible v3.0 (design deliverables preceding frontend work) |

---

## Revision History

| Version | Description |
|---|---|
| 1.0 | **This document.** First full sprint-by-sprint delivery schedule for MVP → V1.0, planned to a production-ready, enterprise-demonstrable standard — not a prototype standard. Expands the Roadmap's phase/epic structure into concrete sprints with full-stack scope, exit criteria, hardening blocks, and enterprise-readiness gates. |

---

## Table of Contents

1. [Purpose and How to Use This Document](#1-purpose-and-how-to-use-this-document)
2. [Planning Assumptions](#2-planning-assumptions)
3. [The Production-Ready Standard](#3-the-production-ready-standard)
4. [Delivery Overview — Blocks, Sprints, Milestones](#4-delivery-overview--blocks-sprints-milestones)
5. [Block A — Platform Foundation (Sprints 1–3)](#5-block-a--platform-foundation-sprints-13)
6. [Block B — Identity & Tenancy (Sprints 4–7)](#6-block-b--identity--tenancy-sprints-47)
7. [Block C — AI Gateway (Sprints 8–10)](#7-block-c--ai-gateway-sprints-810)
8. [Block D — Connector Platform (Sprints 11–13)](#8-block-d--connector-platform-sprints-1113)
9. [Block E — Knowledge Platform (Sprints 14–17)](#9-block-e--knowledge-platform-sprints-1417)
10. [Block F — Decision Intelligence (Sprints 18–21)](#10-block-f--decision-intelligence-sprints-1821)
11. [Block G — Production Hardening & Beta Launch (Sprints 22–24)](#11-block-g--production-hardening--beta-launch-sprints-2224)
12. [V1.0 Expansion (Sprints 25–32)](#12-v10-expansion-sprints-2532)
13. [Parallel Track — Fast-Follow Connectors](#13-parallel-track--fast-follow-connectors)
14. [Cross-Cutting Workstreams (Every Sprint)](#14-cross-cutting-workstreams-every-sprint)
15. [Sprint Ceremonies and Cadence](#15-sprint-ceremonies-and-cadence)
16. [Enterprise Demo Readiness Checklist](#16-enterprise-demo-readiness-checklist)
17. [Timeline Scenarios and Team Scaling](#17-timeline-scenarios-and-team-scaling)
18. [Sprint Tracker](#18-sprint-tracker)
19. [Change Rules for This Document](#19-change-rules-for-this-document)

---

## 1. Purpose and How to Use This Document

The *Roadmap & Implementation Guide* defines **what** gets built and **in what order** (phases, epics, dependencies, milestones). This document turns that into **when and by whom, sprint by sprint** — the working delivery schedule.

It is planned deliberately to a **production standard**: the target output is a platform that can be demonstrated to — and adopted by — real companies, pass an enterprise technical evaluation, and survive a security review. That standard is defined in Section 3 and applies to every sprint. No sprint ships scaffolding, mock data pretending to be features, or "we'll harden it later" code paths without a tracked technical-debt entry.

**How to use it:**

- At sprint planning: open the current sprint's section; its scope is the backlog for the sprint. Adjust only by the change rules (Section 19).
- At sprint review: verify the exit criteria; update the Sprint Tracker (Section 18) and the *Roadmap's* Progress Tracker in the same change.
- The **one-epic-at-a-time rule** (Execution Principle 2) applies at the *epic* level; a sprint may carry cross-cutting workstream items (Section 14) alongside its epic focus.

---

## 2. Planning Assumptions

| Assumption | Value | Notes |
|---|---|---|
| Sprint length | **2 weeks** | Fixed; scope varies, dates don't |
| Core team | 1–2 engineers + AI-assisted development | Matches Risk R-11 (single-founder bandwidth). Section 17 shows how the plan compresses with more engineers |
| Definition of Done | *Engineering Playbook* §19 — in full, every sprint | Tests at all levels, docs, security review, logging, no placeholders |
| Definition of epic completion | *Roadmap* §17 | Implementation + tests + docs + security + observability + deployment readiness |
| Dev environment | Docker Compose, free-tier providers (OpenRouter, local storage, Gmail SMTP) | Free-to-enterprise strategy, *Architecture Bible* §13 |
| Staging/production | Kubernetes, introduced in Block G | No change reaches production without passing staging |
| Design system | Delivered as code (Tailwind tokens) in Sprint 1, per the recorded next-steps sequence: *finalize the design system → create ProjectZero.sln* | *Experience & Design Bible* §10–13 |

**Immediate pre-sprint action (open de-risking item #2):** set the **first-customer-demo target date**. On this plan, the earliest honest enterprise demo is the end of **Block F (Sprint 21)** on seeded data, and the end of **Block G (Sprint 24)** on a customer's real GitHub organization. Set the date, write it into Section 18, and check every sprint against it.

---

## 3. The Production-Ready Standard

"Production-ready" is a gate, not a mood. Every sprint's output must satisfy the Playbook's Definition of Done; in addition, the following platform-level bars are non-negotiable and are verified at every milestone review:

1. **Tenant isolation proven, not promised.** The cross-tenant isolation test suite (attempted cross-tenant reads must fail) exists from Sprint 6 onward and runs in CI on every merge, permanently. A missing tenant scope anywhere — query, cache key, file path, embedding, graph edge — is a critical defect that stops the release.
2. **No vendor SDK in business logic, ever.** All nine provider interfaces (*Architecture Bible* §12.2) are real from Block A; contract-conformance tests run against every implementation.
3. **Security is a construction property.** JWT + RBAC on every endpoint; encrypted secrets and connector tokens; TLS on every hop including .NET↔Python; input validation at every boundary; audit logging on every important action; dependency and image scanning in CI from Sprint 1.
4. **The Trust Layer envelope is structural.** From the first AI response the platform ever produces (Sprint 8), responses carry model, prompt version, token usage, and correlation ID; evidence/sources/confidence join in Blocks E–F. No AI output ships without its envelope.
5. **Observability from day one.** Structured logging with correlation IDs (Sprint 1), health checks per service, metrics and tracing wired progressively, full monitoring stack by Block G. Unobservable features are incomplete features (*Architecture Bible* §39).
6. **Performance targets are binding.** API availability 99.9%+; non-AI API average < 300 ms; typical AI response < 10 s. Load-tested in Block G and validated per release thereafter.
7. **Real error experience.** Global exception middleware, one error envelope, retries with back-off, circuit breakers around AI providers, dead-letter queues with alerts, graceful degradation by feature flag. Users never see a raw stack trace or a silently hung screen.
8. **Enterprise-grade frontend.** The Experience & Design Bible is implemented, not approximated: design tokens only, WCAG 2.2 AA, keyboard navigation, reduced-motion support, designed empty/error states. The interface is part of the product's credibility in front of companies.
9. **Documentation ships with code.** OpenAPI for every endpoint, ADRs for every significant decision, runbooks for every alert, and master-document updates in the same PR as behavior changes.
10. **Honest demos only.** Everything demonstrated at sprint reviews and customer demos runs the real pipeline end-to-end. Seeded demo data is allowed; faked capability is not.

---

## 4. Delivery Overview — Blocks, Sprints, Milestones

| Block | Sprints | Epic(s) | Roadmap Phase | Milestone at Exit |
|---|---|---|---|---|
| **A — Platform Foundation** | 1–3 | Epic 0 | Phase 0 | **M1** Running platform foundation |
| **B — Identity & Tenancy** | 4–7 | Epics 1, 2, 3 | Phase 1 | **M2** Identity operational |
| **C — AI Gateway** | 8–10 | Epic 4 | Phase 2 | **M3** AI Gateway operational |
| **D — Connector Platform** | 11–13 | Epic 5 (GitHub) | Phase 3 | **M4** GitHub connector live |
| **E — Knowledge Platform** | 14–17 | Epic 6 | Phase 4 | **M5** Knowledge Platform live |
| **F — Decision Intelligence** | 18–21 | Epic 7 (MVP scope) | Phase 5 | **M6** Decision Intelligence MVP |
| **G — Hardening & Beta** | 22–24 | Cross-cutting + Epic 11 (partial) | MVP release | **M7** begins — customer validation |
| **V1 Expansion** | 25–32 | Epics 8, 9, 10, 11 + Epic 7 completion | Expansion | **M8** V1.0 released |

Dependency logic (from *Roadmap* §8): tenancy before anything tenant-scoped; AI Gateway before Knowledge (embeddings need providers); Connectors + Knowledge together unlock Decision Intelligence; observability starts in Sprint 1 and hardens continuously.

---

## 5. Block A — Platform Foundation (Sprints 1–3)

**Epic 0. Goal: the entire platform skeleton — all three services, all infrastructure, CI/CD, and the standards machinery — running locally and in CI.** This block is where "production-ready" is made cheap for every later sprint: everything set up here (tests, scanning, tokens, tracing) is inherited by all future work.

### Sprint 1 — Repository, Solution, and Design System as Code

| Workstream | Scope |
|---|---|
| **Repo/DevOps** | Git repository with the fixed structure (`backend/ frontend/ ai-engine/ shared/ docker/ infrastructure/ docs/`); branch protection on `main`; PR template with DoD checklist; GitHub Actions CI: build → static analysis (analyzers/linters, formatting) → unit tests → dependency scan. Warnings are errors on protected branches |
| **Backend** | `ProjectZero.sln`; first module skeleton with Clean Architecture layers (Domain/Application/Infrastructure/Presentation) and enforced project references (dependency rule physically impossible to violate); DI composition root; configuration binding with startup validation; Serilog structured logging with correlation-ID middleware; global exception middleware with the standard error envelope; health check endpoints; API versioning scaffold (`/api/v1`) |
| **Frontend** | Next.js + TypeScript + Tailwind scaffold; **the design system as code**: all approved v3.1 tokens (Zoned Graphite: header `#101114`, sidebar `#17181C`, canvas `#FAFAFB`, footer `#0B0C0E`; Violet accent `#7C3AED`; semantic palette), Inter typography scale, spacing scale (4px base), radius/elevation tokens wired into Tailwind config; base layout shell (header/sidebar/canvas/footer zones); signature particle-face component |
| **Infra** | Docker Compose: API + PostgreSQL; containerized local run documented |
| **Docs/QA** | `docs/` seeded with the master library + ADR template; test projects created (unit + integration); architecture-conformance tests (layer dependency rules) running in CI |

**Exit criteria:** `docker compose up` produces a healthy, logging, versioned API; CI is green and enforcing; the frontend shell renders the design language, not default Tailwind.

### Sprint 2 — The Polyglot Split and Infrastructure Services

| Workstream | Scope |
|---|---|
| **AI Engine** | Python FastAPI service skeleton; `/api/v1` internal routes; JWT/API-key authentication on every internal call; structured logging with correlation-ID propagation from .NET; health endpoint; test setup (pytest); Dockerfile + Compose entry |
| **Shared contracts** | `shared/` DTO contracts for the .NET↔Python boundary; contract tests on **both** sides (the boundary is the riskiest integration point — *Architecture Bible* §11); contract-change review rule in the PR template |
| **Backend** | `IAIProvider`, `IStorageProvider`, `ICacheProvider`, `IQueueProvider`, `IEmailProvider`, `ISearchProvider`, `INotificationProvider`, `ISecretProvider`, `IConnectorProvider` — all nine interfaces defined in the Application layer with development implementations in Infrastructure (local files, Redis, RabbitMQ, Gmail SMTP, PostgreSQL FTS, appsettings secrets); configuration-driven provider selection through DI; contract-conformance test suite that runs against every implementation of each interface |
| **Infra** | Redis + RabbitMQ + local object storage added to Compose; background worker host (Presentation-layer worker service) consuming a demo queue with idempotent handling, retry/back-off, and dead-letter queue |
| **Docs** | ADRs recorded for anything decided during setup; provider implementation guide (how to add a provider — *Architecture Bible* §12.6) |

**Exit criteria:** .NET calls Python through the authenticated internal contract and gets a typed response; a message published to RabbitMQ is consumed idempotently with a working DLQ; every provider interface has a passing conformance suite.

### Sprint 3 — Tenancy Foundation, Feature Flags, and Test Machinery

| Workstream | Scope |
|---|---|
| **Backend** | Tenant context: established at authentication, carried through every layer, propagated to the AI Engine (`OrganizationId`/`WorkspaceId` on every internal request); **global query filters** at the data layer so an unfiltered tenant query is impossible by default (ADR-10); tenant-prefixed cache-key convention (`{org}:{ws}:domain:key`) enforced in the cache provider; SQL-script migration pipeline per ADR-016 (versioned `V{NNNN}__` scripts, DbUp-based `ProjectZero.Database.Migrator`, `schema_versions` journal, rollback script per migration, CI drift check between scripts and EF entity configurations); data-access two-lane policy per ADR-017 (EF Core simple reads; Dapper SPs/parameterized SQL for bulk, with explicit tenant scope on raw statements) |
| **Feature flags** | Flag foundation: per-organization flag storage, cached evaluation in the application layer, audit on change — the future licensing enforcement mechanism (ADR-15) |
| **Frontend** | Component library first wave: Button (all six states), Input family, Card, Alert/Toast, Skeleton/shimmer loaders, empty-state component — each documented with anatomy/variants/states/accessibility notes (*Design Bible* §27) |
| **QA** | Full test pyramid operational in CI: unit, integration (Testcontainers or Compose-backed), API-contract tests, and the seed of the security suite; coverage reporting with "no decrease on protected branches" gate |
| **Docs/DevOps** | OpenAPI generation published as a CI artifact; developer onboarding guide ("zero to running locally in under 30 minutes"); image build + tag + scan stage in CI |

**Exit criteria: MILESTONE 1 — Running platform foundation.** All services healthy locally and in CI; tenancy plumbing and flags exist before any feature does; the test machinery every future sprint depends on is in place.

---

## 6. Block B — Identity & Tenancy (Sprints 4–7)

**Epics 1 → 2 → 3, in dependency order. Goal: a real multi-tenant identity platform an enterprise security reviewer would accept — because this is the first thing any real company will scrutinize.**

### Sprint 4 — Authentication (Epic 1, part 1)

| Workstream | Scope |
|---|---|
| **Backend** | User registration with email verification (via `IEmailProvider`); login issuing short-lived JWT access tokens + rotating refresh tokens; refresh-token bookkeeping and revocation lists in Redis; password reset with secure token flow; session management (active session listing + revocation); account lockout/throttling on failed attempts; audit events for every auth action |
| **Frontend** | Login experience per *Design Bible* §19.1 (animated intelligence visualization left, minimal auth right — a first, restrained implementation of the particle identity); registration, verification, and reset flows with inline validation and designed error states |
| **QA/Security** | Auth security tests: token expiry/rotation/revocation, brute-force throttling, enumeration resistance; API tests for every auth endpoint |

**Exit criteria:** the recorded first checkpoint — *a running solution with an authentication skeleton* — exceeded: full auth lifecycle works and is tested, not skeletal.

### Sprint 5 — RBAC and Policy Authorization (Epic 1, part 2)

| Workstream | Scope |
|---|---|
| **Backend** | Role model (Platform Owner, Organization Administrator, Workspace Administrator, Member, AI Agent identities — *Product Bible* §8); policy-based authorization layered on roles, enforced at the use-case layer of every endpoint; least-privilege defaults; computed permission-set caching in Redis with event-driven invalidation on role change |
| **Frontend** | Role/permission management surfaces; navigation and actions that honestly reflect permissions (no dead buttons for unauthorized users) |
| **QA/Security** | Authorization matrix tests: every role × every protected endpoint; negative tests are the point — unauthorized access must fail, provably |

**Exit criteria:** Epic 1 acceptance criteria fully met — secure authentication flow, protected APIs, role enforcement, token refresh.

### Sprint 6 — Organizations and the Isolation Gate (Epic 2)

| Workstream | Scope |
|---|---|
| **Backend** | Organization create/update; organization settings; tenant configuration store (AI provider, branding, storage provider, notification provider, security policies, retention, region, licensing — versioned, audited, applied dynamically per *Architecture Bible* §15); branding applied per tenant; subscription details placeholder (plans arrive with Epic 10) |
| **Frontend** | Organization onboarding flow (registration → org creation) completable by a non-technical administrator; org settings and branding UI |
| **QA/Security** | **The cross-tenant isolation test suite** — attempted cross-tenant reads across every tenant-scoped table, cache key, and file path must fail. This suite is permanent, non-skippable, and blocks every future release (*Engineering Playbook* §10.1) |

**Exit criteria:** organizations are fully isolated (proven by the suite); configuration is stored per tenant; branding applies dynamically.

### Sprint 7 — Workspaces, Audit, and the Zero State (Epic 3)

| Workstream | Scope |
|---|---|
| **Backend** | Workspaces (multiple per organization); team management; member invitations (email flow); workspace settings; workspace-level permissions as the second isolation boundary; audit logging foundation: who did what, when, to what, from where — searchable, immutable |
| **Frontend** | Workspace creation and member management UI; user profile management; **the designed zero state** (*Design Bible* §23): a new workspace presents the three first moves — connect a system, upload a document, ask a question — never a blank screen |
| **QA** | Isolation suite extended to workspace scope; invitation flow E2E test |

**Exit criteria: MILESTONE 2 — Identity operational.** Onboarding (create org → create workspace → invite members) works end-to-end without support intervention; RBAC and isolation are enforced and tested at both boundaries.

---

## 7. Block C — AI Gateway (Sprints 8–10)

**Epic 4. Goal: every AI request in the platform flows through one governed, metered, provider-agnostic gateway — the architectural heart of the product's credibility.**

### Sprint 8 — The Gateway Path

| Workstream | Scope |
|---|---|
| **Backend** | AI Gateway module (.NET): the single entry point — authorization, tenancy, and quota checks before anything reaches the engine; request logging with correlation IDs (immutable audit); response metadata capture (model used, token usage, finish reason) |
| **AI Engine** | `IAIProvider` implementation path: OpenRouter provider (ADR-12) behind the abstraction; completion + streaming; error normalization (timeouts, rate limits, provider errors mapped to the standard envelope — never leaked raw) |
| **Frontend** | Streaming plumbing (SSE/SignalR) proven with a minimal internal test surface (the real chat UI arrives in Block F) |
| **QA** | Contract tests for the AI request/response DTOs; streaming integration test; "no direct vendor calls anywhere" verified by static analysis rule |

**Exit criteria:** an AI request routes client → gateway → engine → provider and back with full metadata recorded; the codebase physically cannot call a vendor directly.

### Sprint 9 — Prompt Governance

| Workstream | Scope |
|---|---|
| **Backend/AI Engine** | Prompt Manager: prompts as versioned artifacts (identity + version, stored, retrievable); no inline prompt strings in business code (lint-enforced); prompt rollback; per-organization model configuration (tenant AI provider selection); evaluation harness skeleton — the structure for running a prompt against an evaluation set, to be filled as real prompts accumulate |
| **Frontend** | Internal prompt administration surface (list, versions, rollback) — Platform Owner scope |
| **QA** | Prompt version recorded on every response (Trust Layer input); rollback test |

**Exit criteria:** every AI response records its prompt version; changing or reverting a prompt is a governed, instant operation.

### Sprint 10 — Routing, Resilience, and Metering

| Workstream | Scope |
|---|---|
| **Backend/AI Engine** | Model Router: provider/model chosen per request by configuration, cost, capability, availability; failover between providers; circuit breakers around every provider with open-circuit → failover behavior; response caching for identical grounded queries (tenant-scoped keys); rate limiting per identity and per tenant (Redis counters) |
| **Metering** | Token usage, API calls, and cost tracked per request, per workspace, per organization — the Cost Management capability (*Architecture Bible* §31), feeding Billing later and dashboards now |
| **Frontend** | Basic AI usage visibility for administrators (tokens/cost per workspace) |
| **QA** | Chaos-style provider tests: provider down → failover works; provider slow → circuit opens; metering accuracy tests |

**Exit criteria: MILESTONE 3 — AI Gateway operational.** Provider switching is configuration-only (proven by swapping providers in a test without code change); usage metrics recorded for every request; the gateway survives a provider outage gracefully.

---

## 8. Block D — Connector Platform (Sprints 11–13)

**Epic 5, MVP scope: the SDK plus GitHub only (locked decision — *Product Bible* Appendix A). Goal: integration machinery reliable enough that a company trusts it with their code and credentials.**

### Sprint 11 — The Connector SDK

| Workstream | Scope |
|---|---|
| **Backend** | Connector SDK: standard `IConnector` contract; OAuth 2.0 foundation — encrypted token storage (keys via `ISecretProvider`), automatic refresh with failure alerting, revocation on disconnect (upstream where supported + local credential destruction always), minimal scopes; synchronization engine with per-connector scheduling; cursor/state tracking in Redis; automatic retry with back-off; DLQ + alerting for failed syncs |
| **QA** | SDK proven against a **reference fake connector** in tests (auth lifecycle, sync, retry, revocation) before any real connector exists — the SDK is the product here |
| **Docs** | Connector developer guide: how connector #2 gets built on this SDK |

**Exit criteria:** the SDK passes its full lifecycle test suite against the reference connector; token security (encrypt/refresh/revoke) verified.

### Sprint 12 — The GitHub Connector

| Workstream | Scope |
|---|---|
| **Backend** | GitHub connector on the SDK: OAuth app flow; sync of repositories, issues, pull requests, commits, README/docs content; pagination and GitHub rate-limit budget handling; incremental sync via cursors; entity normalization into the ingestion-ready content model |
| **Frontend** | Connector experience: connect flow (OAuth redirect done properly), connector cards with live sync status, sync history, disconnect with revocation |
| **QA** | Integration tests against a controlled GitHub test organization; sync idempotency tests (re-sync must not duplicate) |

**Exit criteria:** a real GitHub organization connects and syncs; content lands normalized and tenant-scoped; status is visible at all times.

### Sprint 13 — Webhooks and Sync Reliability Hardening

| Workstream | Scope |
|---|---|
| **Backend** | GitHub webhooks for real-time updates (with signature verification); reconciliation between webhook and scheduled sync; failure alerting through the notification seam; back-pressure behavior on large orgs (thousands of repos/issues) |
| **Frontend** | Dashboard connector-status widget (first Mission Control widget) |
| **QA** | Soak test: large-repository sync completes within resource budgets; kill-and-resume test: interrupted sync recovers from cursors without data loss or duplication |

**Exit criteria: MILESTONE 4 — GitHub connector live.** Reliable under volume, resumable, observable, secure. Connector failures retry automatically and alert.

---

## 9. Block E — Knowledge Platform (Sprints 14–17)

**Epic 6. Goal: connected content becomes tenant-scoped organizational memory with retrieval quality good enough to stake the product's answers on.**

### Sprint 14 — Ingestion Pipeline

| Workstream | Scope |
|---|---|
| **Backend** | Ingestion orchestration: connector content + direct file upload enter one pipeline; `DocumentIndexed`/`KnowledgeUpdated` domain events; upload API with virus/size/type validation |
| **AI Engine** | Parsing for the MVP-priority formats (Markdown, code files, PDF, DOCX, TXT, HTML, JSON/YAML — the formats GitHub + uploads actually produce; the full multimodal matrix lands post-MVP per *Product Bible* §16); chunking with source-reference preservation (repo/file/line, document/page); embedding generation as asynchronous queue workers; **tenant-scoped vector storage** (pgvector) where a retrieval query without tenant scope is structurally impossible |
| **Frontend** | Upload flow with real progress (queue-backed, honest states); ingestion status visibility |
| **QA** | Pipeline tests per format; **embedding isolation tests join the permanent isolation suite**; idempotent re-ingestion (updated file supersedes, doesn't duplicate) |

**Exit criteria:** GitHub content and uploads flow to embeddings asynchronously without user-blocking; every chunk knows its source; isolation proven at the vector layer.

### Sprint 15 — Search

| Workstream | Scope |
|---|---|
| **Backend/AI Engine** | Semantic search over the vector store; PostgreSQL full-text search (ADR-14); hybrid ranking (semantic + keyword); permission-aware results (caller sees only what RBAC allows); search API |
| **Frontend** | Knowledge search experience: search surface with meaningful results (source, snippet, recency), the intelligent-search-placeholder micro-interaction, designed no-results state |
| **QA** | Retrieval quality baseline: a seeded evaluation set of question → expected-source pairs, scored and tracked from this sprint forward (this baseline is what proves retrieval improves rather than regresses) |

**Exit criteria:** meaning-based search across everything the caller may access, with sources; quality baseline recorded.

### Sprint 16 — Context Builder, Memory, and Evidence

| Workstream | Scope |
|---|---|
| **AI Engine** | Context Builder: assembles the most relevant organizational context per request (vector + full-text + recency + entity signals) within a token budget; **organizational memory** with version awareness (updated documents supersede stale knowledge without losing history); **evidence collection**: retrieval retains exactly which chunks, from which sources, supported which response — the Trust Layer's raw material |
| **Backend** | RAG-grounded answering through the gateway: question → context → grounded response with evidence references (internal capability; the full user experience arrives in Block F) |
| **QA** | Evidence fidelity tests: every generated answer's citations must resolve to real retrieved chunks; version-awareness tests (stale content must not outrank its replacement) |

**Exit criteria:** grounded, evidence-carrying answers work end-to-end at the API level; memory versioning behaves.

### Sprint 17 — Knowledge Graph and Retrieval Quality

| Workstream | Scope |
|---|---|
| **AI Engine** | Knowledge graph v1: entity and relationship extraction (people, repos, projects, documents, decisions) into a tenant-scoped graph; graph signals feed the Context Builder; graph isolation tests join the permanent suite |
| **Backend/Frontend** | Knowledge browsing UI: what the organization knows (sources, documents, entities), unified viewer shell v1 (Markdown/code/PDF renderers with citation anchors — *Design Bible* §22) |
| **QA** | Retrieval quality iteration against the Sprint 15 baseline: chunking/ranking tuning with measured improvement; load test on realistic corpus size |

**Exit criteria: MILESTONE 5 — Knowledge Platform live.** Ingestion → embedding → semantic search with citations, memory, and a working graph, at measured quality.

---

## 10. Block F — Decision Intelligence (Sprints 18–21)

**Epic 7, MVP scope. Goal: the product's reason for existing — evidence-backed, auditable answers and Decision Briefs in the Mission Control experience.**

### Sprint 18 — The Trust Layer De-Risk Prototype (mandatory gate)

De-risking action #1 (*Roadmap* §12) — required **before** Epic 7 feature development:

| Workstream | Scope |
|---|---|
| **Prototype** | One complete end-to-end evidence-backed answer against a **real** LLM response and **real** retrieved evidence, rendered in the real UI: answer, evidence cards, navigable citations, confidence display, audit metadata (model, prompt version). Evaluated with actual users/founders against the question: *can a leader defend this answer to their board?* |
| **Backend** | Trust Layer envelope finalized as a schema: evidence, sources, confidence score, audit trail, model info, prompt version, approval status (*Product Bible* §18.2) — recorded for every AI response from here on |
| **AI Engine** | Confidence scoring v1 via the evaluation engine (retrieval strength + grounding coverage signals — honest, including *low*) |
| **Design** | Trust Layer UX decisions locked from prototype findings (the single largest product risk, R-5 — this sprint exists to kill it) |

**Exit criteria:** the prototype convinces on real data; Trust Layer schema and UX pattern locked. **If it does not convince, Block F pauses and this sprint repeats with redesign — that is the point of the gate.**

### Sprint 19 — The AI Workspace

| Workstream | Scope |
|---|---|
| **Frontend** | The Mission Control workspace (*Design Bible* §8): AI chat with streaming responses, markdown + syntax highlighting, conversation list/history, suggested prompts, response actions (copy, regenerate); the particle identity's core states (Idle/Listening/Thinking/Researching/Speaking) driven by **real** pipeline state, with reduced-motion alternatives; layered evidence panels (progressive disclosure, not page navigation) |
| **Backend** | Conversation persistence (searchable, auditable); the user-visible pipeline stages surfaced honestly (Question → Context → Knowledge Search → Evidence → Reasoning → Confidence → Answer — *Product Bible* §12.3) |
| **QA** | E2E: ask → grounded answer with citations in the real UI; accessibility audit of the workspace (keyboard, screen reader, contrast on dark surfaces) |

**Exit criteria:** a member asks a real business question about their connected GitHub content and receives a streamed, evidence-backed, citated answer in the finished workspace experience.

### Sprint 20 — Decision Briefs

| Workstream | Scope |
|---|---|
| **Backend/AI Engine** | Decision Brief generation: question, recommendation up front, supporting evidence, navigable source citations, confidence score, assumptions, reasoning path (*Product Bible* §17.2); brief persistence and retrieval; `DecisionGenerated` event |
| **Frontend** | The Decision experience (*Design Bible* §19.3): brief layout with recommendation-first hierarchy, evidence cards, honest confidence display, audit metadata on inspection |
| **QA** | Brief quality evaluation set (question → expected evidence coverage); every-brief-has-evidence enforced as a test, not a hope |

**Exit criteria:** Decision Briefs generate from real organizational content with the full trust envelope.

### Sprint 21 — Feedback, Audit, and MVP Feature-Complete

| Workstream | Scope |
|---|---|
| **Backend** | Feedback collection: approve/reject on recommendations, ratings on responses; feedback stored against brief/response + prompt version + retrieval snapshot (the learning loop's raw data); acceptance-rate metrics; decision history (permanent, searchable, auditable); approval-status workflow on briefs (pending/approved/rejected, by whom) |
| **Frontend** | Inline feedback controls; decision history and audit views; the executive dashboard v1: Decision Queue, Recent Decisions, Connector Status, AI Usage, Activity Feed widgets |
| **QA** | Full MVP regression: the critical path (onboard → connect GitHub → ingest → ask → brief → feedback) as an automated E2E suite |

**Exit criteria: MILESTONE 6 — Decision Intelligence MVP.** The complete MVP one-liner works end-to-end: *Authentication + Organizations + RBAC + GitHub Connector + AI Workspace + Knowledge + Decision Briefs + Evidence-backed Responses.*

---

## 11. Block G — Production Hardening & Beta Launch (Sprints 22–24)

**Goal: convert a feature-complete MVP into a system real companies can be onboarded to.** This block is not optional polish — it is the difference the founders asked for between a portfolio piece and a product.

### Sprint 22 — Security and Performance Hardening

| Workstream | Scope |
|---|---|
| **Security** | Full-platform security review against *Engineering Playbook* §13: authN/authZ audit on every endpoint; secrets migrated to vault-backed `ISecretProvider`; dependency + container image audit with all criticals resolved; penetration-style testing (OWASP Top 10, auth bypass, IDOR/cross-tenant attempts, prompt-injection handling at the AI boundary); threat-model review of the connector OAuth and .NET↔Python surfaces; security findings outrank all feature work |
| **Performance** | Load testing against binding targets: non-AI API avg < 300 ms, AI responses < 10 s typical, ingestion throughput on realistic corpora; profiling and fixes; database index review; cache hit-rate review |
| **QA** | Regression re-run post-hardening; performance baselines recorded for the release process |

**Exit criteria:** zero known critical vulnerabilities; performance targets met with recorded evidence.

### Sprint 23 — Staging, Observability, and Operational Readiness

| Workstream | Scope |
|---|---|
| **Infra** | Staging environment on Kubernetes with production-like topology (the promotion path: Dev → Staging → Production, *Engineering Playbook* §12); IaC for environment rebuild; versioned, tagged, rollback-capable deploys; database migration rollback verified |
| **Observability** | Full stack: OpenTelemetry instrumentation, Prometheus metrics, Grafana dashboards (API, AI latency/cost, queue depth, connector health, DB); distributed tracing across client → gateway → module → queue → worker → AI engine; alerting with a runbook per alert |
| **Operations** | Automated backups + **verified restore** (a backup never restored is not a backup); incident severity classification + response process; on-call/ownership defined |
| **QA** | Full E2E suite green on staging; chaos drills: kill a worker, drop a provider, fill a queue — platform degrades gracefully and alerts |

**Exit criteria:** staging is a trustworthy rehearsal of production; failures are detectable within minutes; restore is proven.

### Sprint 24 — Production Launch and Design-Partner Onboarding

| Workstream | Scope |
|---|---|
| **Launch** | Production deployment through the full release process (*Engineering Playbook* §20): QA validation → security review → performance validation → approval → deploy → heightened monitoring → post-release verification |
| **Beta** | 3–5 design-partner companies from the beachhead (B2B SaaS, 20–200 employees) onboarded onto their **real GitHub organizations**; white-glove onboarding while measuring the product promise: decision-time reduction, recommendation acceptance rate, weekly active leadership users |
| **Demo readiness** | Seeded demo organization with realistic content for sales demos; demo script matching the Section 16 checklist; feedback intake loop into the backlog |
| **Docs** | User-facing documentation (getting started, connector setup, understanding Decision Briefs); operational runbooks complete |

**Exit criteria: MVP in production; MILESTONE 7 (customer validation) begins.** Real companies, real data, real measurements running.

---

## 12. V1.0 Expansion (Sprints 25–32)

**Epics 8–11 + Epic 7 completion.** Per the *Roadmap*, customer validation (Milestone 7) informs this scope — re-plan this section at Sprint 24 review with design-partner evidence. The default plan:

| Sprint | Epic focus | Scope summary | Exit criteria |
|---|---|---|---|
| **25** | Epic 8 — Administration (1/2) | Platform administration: org/user/license management surfaces; feature-flag administration per organization; system health dashboard (Grafana-backed, admin-visible) | Administrators manage all platform resources |
| **26** | Epic 8 — Administration (2/2) | Searchable audit-log UI; admin hardening; Platform-Owner global configuration | Audit history searchable; flags configurable per org |
| **27** | Epic 9 — Notifications | Email + in-app + scheduled notifications; AI task completion alerts; connector failure alerts; user preference center; delivery reliability (queue-backed, retried) | Reliable delivery; preferences respected |
| **28** | Epic 10 — Billing & Licensing (1/3) | Plan definitions (Free/Starter/Professional/Enterprise) as feature-flag bundles + quota sets; licensing enforcement at the use-case layer; complete TD-1 (quota billing mechanics design) | Entitlements enforce per organization |
| **29** | Epic 10 — Billing & Licensing (2/3) | Usage metering completion (tokens, API calls, storage, queue, connector usage, monthly workspace cost); quota behavior at limits per *Product Bible* §21.2 (clear notice approaching limits; queue-or-decline with upgrade path at hard limit — never silent failure) | Usage accurately tracked; limit behavior honest |
| **30** | Epic 10 — Billing & Licensing (3/3) | Payment integration (e.g., Stripe behind an interface); invoice generation; subscription lifecycle (upgrade/downgrade/cancel); pricing set from validation data (closes TD-7) | A company can pay for the product |
| **31** | Epic 11 — Observability hardening + DR | Enterprise observability maturity; RTO/RPO formalized as Enterprise-tier commitments (closes TD-2); DR rehearsal; multi-environment operational polish; Elasticsearch trigger metrics defined (closes TD-3) | DR rehearsed; commitments documented |
| **32** | Epic 7 completion + V1 release | Full Decision Intelligence: deepened approval workflows, learning-loop measurement (acceptance-rate trend demonstrably used), executive dashboard completion; V1.0 release through the full release process | **MILESTONE 8 — V1.0 released** |

**V2 (directional, planned after V1 validation):** Marketplace, vertical packs, advanced AI agents, mobile/desktop — per *Roadmap* §14. Not scheduled until V1 is stable in production.

---

## 13. Parallel Track — Fast-Follow Connectors

Slack, Gmail, Google Drive, and Notion are the fast-follow set (*Product Bible* Appendix A) — scheduled **after** GitHub validates the SDK:

- **With a second engineer available:** run as a parallel track from Sprint 14 onward (one connector ≈ one sprint each on a proven SDK), landing all four before MVP launch. The SDK was built precisely so this parallelizes safely.
- **Solo:** interleave into Sprints 25–30 (one connector per sprint alongside the V1 epic focus) or prioritize by design-partner demand from Sprint 24 feedback.

Each connector inherits the SDK's OAuth security, sync engine, retry, and status surfaces — its sprint scope is source-specific sync logic, entity normalization, webhook support where offered, and integration tests.

---

## 14. Cross-Cutting Workstreams (Every Sprint)

These run inside every sprint regardless of epic focus; they are why the plan doesn't need a "quality sprint" at the end of each block:

| Workstream | Standing content |
|---|---|
| **Security** | Tenant-isolation and authZ checks in every PR review (severity-ordered review per *Playbook* §9); dependency alerts patched promptly |
| **Testing** | The permanent suites (isolation, provider conformance, contract, idempotency) run on every merge; coverage never decreases on protected branches |
| **Observability** | Every new feature ships with logging, metrics, and health integration — unobservable features are incomplete |
| **Documentation** | OpenAPI, ADRs, and master-document updates in the same PR as the change; stale docs are defects with owners |
| **Design** | Component library grows ahead of feature UI (new components are reusable before feature-specific); accessibility review per component lifecycle |
| **Technical debt** | Every temporary compromise lands in the *Roadmap* §15 register with planned resolution — in the same PR |

---

## 15. Sprint Ceremonies and Cadence

| Ceremony | When | Content |
|---|---|---|
| **Sprint planning** | Day 1 | Pull this document's sprint scope; verify against the Decision Framework (*Foundation & Strategy* §12) — nothing enters that doesn't trace to product requirements; size honestly; carry-over is declared, not hidden |
| **Mid-sprint check** | Day 5–6 | Scope at risk? Cut scope, never quality — the DoD is not negotiable |
| **Sprint review/demo** | Last day | Demo against exit criteria on the real pipeline; no slideware |
| **Retrospective** | Last day | Process improvements → this document or the Playbook, in writing |
| **Tracker update** | Last day | Section 18 here + *Roadmap* §18 Progress Tracker updated in the same commit |

---

## 16. Enterprise Demo Readiness Checklist

What must be true before Project Zero is shown to a real company as a product (target: end of Block G):

**Product experience**
- [ ] Onboarding: org → workspace → invite → connect GitHub, completable by a non-technical admin without help
- [ ] The critical loop works live: connect → ingest → ask → evidence-backed answer → Decision Brief → approve/reject
- [ ] Every AI answer shows evidence, navigable citations, and honest confidence — including low confidence
- [ ] Zero states, loading states, and error states are all designed experiences; nothing dead-ends
- [ ] The interface reads as the Design Bible v3.1 intends: zoned graphite theme, violet accent, signature particle face, purposeful motion, Mission Control — not an admin panel

**Trust & security (what their technical evaluator will ask)**
- [ ] Tenant isolation explained *and demonstrated* (the test suite is a sales asset)
- [ ] Data ownership story: their data, their API keys optionable, configurable retention
- [ ] OAuth scopes minimal; token encryption/refresh/revocation documented
- [ ] Audit trail shown live: who asked what, what was retrieved, what was answered
- [ ] Security review summary available (findings + resolutions); no known criticals
- [ ] Provider-agnosticism demonstrated: switch AI provider by configuration in front of them

**Operational credibility**
- [ ] 99.9% availability target with monitoring dashboards to show
- [ ] Backup/restore verified; incident process exists
- [ ] Performance: snappy non-AI interactions (< 300 ms), AI answers within honest progress UX (< 10 s typical)

**Commercial readiness (by V1)**
- [ ] Plan tiers live with real entitlement enforcement
- [ ] Usage transparency: they can see their own consumption
- [ ] Pricing validated with design partners

---

## 17. Timeline Scenarios and Team Scaling

| Scenario | Team | MVP in production (Block G exit) | V1.0 (Milestone 8) |
|---|---|---|---|
| **Baseline** | 1 engineer + AI-assisted | ~24 sprints ≈ **12 months** | ~32 sprints ≈ **16 months** |
| **Recommended** | 2 engineers (backend/AI + frontend/full-stack) + AI-assisted | ~17–18 sprints ≈ **8–9 months** (frontend parallelizes from Block B; connectors parallelize from Block E) | ~24 sprints ≈ **12 months**, fast-follow connectors included |
| **Funded** | 4 engineers (backend, AI engine, frontend, DevOps/QA) | ~13–14 sprints ≈ **6–7 months** | ~19–20 sprints ≈ **9–10 months** |

Scaling rules: parallelize only along module boundaries (that's what they're for); the one-epic-at-a-time rule applies per engineer/track, not per company; Blocks A and B do not parallelize well (everything depends on them) — extra capacity there goes to the frontend component library and test machinery. Blocks C–F parallelize cleanly against frontend and connector tracks.

**The honest statement this plan makes:** a production-grade, enterprise-demonstrable MVP of this platform is a 6–12 month effort depending on team size — not a semester project. The documentation set was written for exactly this ambition; this schedule matches it.

---

## 18. Sprint Tracker

Updated at every sprint close (mirrors *Roadmap* §18):

| Field | Value |
|---|---|
| Current company phase | Phase 3 — MVP Development |
| Current block | **A — Platform Foundation** |
| Current sprint | **Sprint 1** (not started) |
| Sprints completed | 0 of 24 (MVP) / 0 of 32 (V1.0) |
| MVP progress | 0% |
| Next milestone | M1 — Running platform foundation (Sprint 3 exit) |
| First-customer-demo target date | **OPEN — set immediately (de-risking action #2)** |
| Active technical debt items | TD-1…TD-7 (see *Roadmap* §15) |

Per-sprint log (append one row at each sprint close):

| Sprint | Dates | Epic focus | Exit criteria met? | Carry-over | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

---

## 19. Change Rules for This Document

1. **Scope moves between sprints; quality bars never move.** The Definition of Done and the Section 3 standard are not sprint variables.
2. Any scope change must pass the Decision Framework (*Foundation & Strategy* §12) and respect the dependency map (*Roadmap* §8).
3. Milestone gates are hard: a block does not close with failing exit criteria; the schedule slips instead — and the slip is recorded honestly in the tracker.
4. The Sprint 18 Trust Layer gate can pause Block F. That is by design (Risk R-5); do not route around it.
5. Re-plan points: **Sprint 24 review** (design-partner evidence re-scopes V1) and any milestone review where exit criteria failed.
6. Updates to this document land in the same PR as the sprint-close tracker update. This document supersedes no master document — it *executes* Document 06.

---

## References

- *Roadmap & Implementation Guide v3.0* — phases, epics, backlog, dependency map, milestones this schedule executes.
- *Product Bible v3.0* — acceptance criteria behind every sprint's exit criteria.
- *Architecture Bible v3.0* — Phase 0 scope, ADRs, tenancy/provider/trust mechanics built in Blocks A–F.
- *Engineering Playbook v3.0* — Definition of Done, testing strategy, CI/CD, release process enforced every sprint.
- *Experience & Design Bible v3.0* — design system, workspace, and accessibility standards implemented across all frontend scope.
- *Foundation & Strategy v3.0* — the decision framework guarding every scope change.

---

*End of Project Zero Sprint Plan & Delivery Schedule v1.0 — Working Document 07 of 07.*
