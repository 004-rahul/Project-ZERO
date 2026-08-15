# ADR-020 — AI pipeline: retrieval quality and cost control as one decision

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Founders |
| **Related** | ADR-05 (PostgreSQL), ADR-12 (OpenRouter), ADR-14 (PG full-text); *Architecture Bible* §20.4, §21.1, §22.1.1, §31.1; *Product Bible* FR-26; *Engineering Playbook* §10 |

---

## Context

Two problems were raised separately: token cost at scale, and retrieval quality good enough to stake the product's answers on. Investigation shows they are **one problem**.

Weak retrieval is compensated for by sending more chunks and hoping the answer is among them. Twenty chunks instead of five is 4× the input tokens **on every query, permanently**. Poor retrieval is therefore not a quality issue that also costs money — it is a standing cost multiplier that also degrades answers. Treating them as separate workstreams leads to optimising the wrong one: teams tune prompts and models for cost while leaving the multiplier in place.

A second consideration shapes the decision: the corpus is **code and issues**, dense with exact identifiers — function names, error strings, ticket IDs, commit SHAs. Pure vector search is weak on exact tokens.

## Decision

One pipeline decision covering both concerns.

### Retrieval (ingestion-time — cannot be retrofitted without re-indexing every customer)

| Element | Specification |
|---|---|
| **Contextual chunk enrichment** | Before embedding, a model reads the containing document and writes 50–100 tokens situating the chunk; prepended before both embedding and lexical indexing |
| **Hybrid retrieval** | `pgvector` semantic search **and** PostgreSQL full-text lexical search over the same enriched chunks, results fused |
| **Reranking** | Retrieve ~20 candidates, rerank with a small dedicated model, pass ~4 to generation |
| **Storage model** | Source text + provenance is the record; embeddings are a derived cache keyed by embedding-model version (FR-26) |

Published measurements for this combination: ~35% fewer retrieval failures from contextual embeddings alone, ~49% with contextual lexical search added, **~67% with reranking** (5.7% → 1.9%).

### Cost control (four independently switchable layers)

| Layer | Realised through |
|---|---|
| Cache-aware prompt layout — stable prefix first, retrieved chunks last | Prompt Architecture §21.1 |
| Retrieval quality — fewer, better chunks | The above |
| Model cascade — cheap model first, escalate on low confidence | The **Model Router** already specified in §20.1 |
| Semantic cache — skip the call on semantically similar prior questions | `ICacheProvider` |

**Context compression is permitted only where the evaluation score is demonstrably unchanged.** It is lossy; for an evidence-backed product a dropped source sentence is worse than the token cost.

### Sequencing

Retrieval design and cache-aware prompt layout are adopted **from the start** — both are ingestion- or authoring-time decisions that are expensive to retrofit. Cascade routing and semantic caching are tuned **against real query logs**; building them before traffic exists optimises a guess.

## Consequences

### Positive

- Measured blended cost falls from ~$0.021 to ~$0.006 per query (§31.1) while answer quality improves — the two are not traded against each other.
- No new datastore: PostgreSQL provides both retrieval halves (ADR-05, ADR-14).
- Every layer is an existing abstraction being filled in, not new machinery.
- Model independence is preserved and made cheap: re-embedding on model change is affordable because embedding models cost one to two orders of magnitude less than generation. This is what makes FR-27 (portable export) real.

### Negative — accepted

1. **Ingestion becomes more expensive.** Contextual enrichment costs one model call per chunk (~$1 per million document tokens with prompt caching). Paid once per document, saved on every query about it thereafter. **Consequence: the free tier must cap corpus size, not only query count** (*Foundation & Strategy* §17.2).
2. **The cascade threshold is a live cost variable.** Too loose leaks errors; too tight escalates everything. Must be tuned against the evaluation sets, never by intuition.
3. **Semantic cache is isolation-critical.** A cache key omitting tenant or corpus version serves a confidently stale — or cross-tenant — answer. It is treated as a §16 component and covered by the isolation suite.
4. **More moving parts in the retrieval path**, and therefore more that can silently regress. Mitigated by the evaluation set below, which is the real control.

### The control that makes all of this reviewable

**A scored evaluation set is mandatory from the sprint that retrieval exists** — question → expected-source pairs, run on every change, reported as a number. This is what makes retrieval changes safe to accept in a codebase where the AI Engine is not the team's strongest language, because it verifies **behaviour rather than implementation**. It is added to the required test levels in *Engineering Playbook* §10.1.

## Compliance

Per §39: module boundaries preserved; provider abstraction maintained (every layer sits behind an existing interface); **tenant isolation extended, not weakened** — the semantic cache joins the isolation suite; security standards unaffected; observability — retrieval scores, cache hit rate, escalation rate, and cost per query become first-class metrics (§29); documented before implementation. ✅

## Follow-up actions

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Hybrid index (vector + full-text) populated at ingest | Engineering | With first ingestion |
| 2 | Contextual enrichment in the ingestion pipeline | AI Engineering | With first ingestion |
| 3 | Evaluation set built and wired into CI | QA / AI Engineering | With first retrieval |
| 4 | Cache-aware layout applied to every prompt from the first one | AI Engineering | With first prompt |
| 5 | Ingestion cost metered per tenant | Engineering | With first ingestion |
| 6 | Cascade and semantic cache tuned once query logs exist | AI Engineering | Post-traffic |
