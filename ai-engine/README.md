# Project Zero — AI Engine (Python / FastAPI)

The dedicated Python AI Engine — a **first-class platform component, never a helper
library** (Architecture Bible §10, ADR-04). It owns all intelligence workloads:
LLM providers, RAG pipeline, embeddings, memory, evaluation, prompt execution,
knowledge graph processing, and multimodal intelligence.

## Status

**Skeleton only.** Full build is **Sprint 2** scope (Sprint Plan, Block A):
FastAPI service, `/api/v1` internal routes, JWT/API-key authentication,
correlation-ID propagation from .NET, shared DTO contracts, pytest setup.

The minimal app in `app/main.py` exists so the service boundary and folder
shape are real from day one.

## Rules (binding)

- Reached **only** through the .NET AI Gateway via the internal contract
  (Architecture Bible §11) — never directly by clients.
- Holds **no business rules**: authorization, quotas, and tenancy decisions are
  made by the business platform before requests arrive here.
- Every request carries `OrganizationId`/`WorkspaceId`; all retrieval, embedding,
  and memory operations are tenant-scoped.

## Run (once Sprint 2 lands)

```bash
python -m venv .venv
.venv\Scripts\activate       # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
