"""Project Zero AI Engine — service skeleton.

Full implementation is Sprint 2 scope (internal /api/v1 contract, JWT/API-key
auth, correlation-ID propagation, shared DTOs). This skeleton establishes the
service boundary so the polyglot split (ADR-04) exists from day one.
"""

from fastapi import FastAPI

app = FastAPI(
    title="Project Zero AI Engine",
    version="0.1.0",
    docs_url="/docs",
)


@app.get("/health/live")
def health_live() -> dict[str, str]:
    """Liveness probe: the process is up."""
    return {"status": "healthy", "service": "ai-engine"}
