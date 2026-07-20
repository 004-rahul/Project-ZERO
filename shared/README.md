# Project Zero — Shared Contracts

DTO contracts for the **.NET ↔ Python boundary** — the riskiest integration
point in the platform (Architecture Bible §11).

## Rules (binding)

- Contracts change **only** through reviewed API-change PRs.
- Both sides carry contract tests against these definitions (Engineering
  Playbook §10.3).
- Versioned from day one: breaking changes require a new version and a
  migration window.

## Status

Populated in **Sprint 2** together with the AI Engine's internal `/api/v1`
contract: AI request/response envelopes (tenant context, prompt reference +
version, model preferences, token budget → content, model used, token usage,
finish reason, evidence references).
