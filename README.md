# Project Zero

**AI-native Enterprise Intelligence Platform** — connects the tools an organization
already uses, builds a permanent organizational memory, and answers business
questions with evidence-backed, auditable recommendations.

> **New here? Start with the [Developer Guide & System Wiki](docs/DEVELOPER_GUIDE.md)** —
> how the backend, frontend, Python AI engine, Docker, and infrastructure connect,
> with run instructions and request-flow diagrams.
>
> The complete documentation library lives in [`docs/master-documents/`](docs/master-documents/) —
> seven documents covering strategy, product, architecture, design, engineering
> standards, the roadmap, and the sprint-by-sprint delivery schedule.
> Technical decisions are in [`docs/adr/`](docs/adr/).

> ### ⚠️ Current repository state
>
> **This repository currently contains documentation only.** The `backend/`,
> `frontend/`, `ai-engine/`, `shared/`, `docker/`, and `infrastructure/`
> directories described below were deleted on 2026-08-15 (commits `e6fbc39`,
> `09f9153`) as a deliberate reset. The structure and commands in this README
> describe the **intended** shape of the repository — they are the plan, not a
> description of what is on disk today. Prior code remains recoverable from git
> history.
>
> Delivery restarts at **Sprint 1** (*Sprint Plan* §5).

## Repository Structure (Architecture Bible, Appendix A)

```
├── backend/          # ASP.NET Core (.NET 8) modular monolith — Clean Architecture per module
├── frontend/         # React (Vite) + TypeScript + Tailwind (Design Bible tokens)
├── ai-engine/        # Python FastAPI AI Engine (skeleton — built out in Sprint 2)
├── shared/           # Shared contracts for the .NET ↔ Python boundary (Sprint 2)
├── docker/           # Docker Compose for machines/CI that have Docker
├── infrastructure/   # IaC & Kubernetes manifests (Sprint 23)
├── docs/             # Master documents + ADRs
└── .github/          # CI pipeline + PR template with the Definition of Done
```

## Quick Start

### Backend (.NET 8 — builds and tests on this machine)

```powershell
cd backend
dotnet build ProjectZero.sln     # 0 warnings, 0 errors — warnings are errors by policy
dotnet test ProjectZero.sln      # unit + architecture + integration suites
dotnet run --project src/ProjectZero.Api
# → http://localhost:5080/api/v1/platform/info
# → /health/live · /health/ready · /swagger (Development)
```

Without Docker/PostgreSQL the readiness check skips the database (empty
connection string). With Docker: `docker compose -f docker/docker-compose.yml up`.

### Frontend (React + Vite)

```powershell
cd frontend
npm install
npm run dev
# → http://localhost:3000        (landing) → /login → /register → /dashboard
```

## Sprint Status

| | |
|---|---|
| Current sprint | **Sprint 1 — not started.** An earlier Sprint 1 build (solution skeleton, frontend, design system as code) was completed and then deliberately deleted on 2026-08-15; it is recoverable from git history but is not the current baseline |
| Blocked on | *Design Bible* v5.1 §9–§10 re-baseline is **done**; Sprint 1 can proceed once the frontend is scaffolded on React + Vite (ADR-018) |
| Next | Sprint 2 — Python AI Engine + shared contracts + Redis/RabbitMQ + the ten provider interfaces |
| Delivery plan | [`docs/master-documents/07_..._Sprint_Plan_..._v1.0.md`](docs/master-documents/) |

## Non-Negotiables (see Engineering Playbook)

- Tenant isolation in every tenant-facing change — missing scope is a critical defect.
- No vendor SDK in business logic — provider interfaces only.
- Warnings are errors; tests at all required levels; PRs follow the Definition of Done.
