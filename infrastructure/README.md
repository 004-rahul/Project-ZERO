# Project Zero — Infrastructure

Infrastructure-as-code and Kubernetes manifests.

## Status

- `kubernetes/` — staging/production manifests land in **Sprint 23** (Block G:
  staging on Kubernetes, promotion path Dev → Staging → Production per
  Engineering Playbook §12).
- Local development uses Docker Compose (`../docker/`) where Docker is
  available; on machines without Docker the API runs directly via
  `dotnet run` with a locally installed PostgreSQL or an empty connection
  string (readiness check skips the database when unconfigured).
