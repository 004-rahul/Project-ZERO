# ADR-019 — `IConnector` implemented primarily as a Model Context Protocol host

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Founders |
| **Supersedes** | The "MCP as long-term connector substrate" position in *Architecture Bible* §23.4 and *Foundation & Strategy* §6.2 |
| **Related** | ADR-08 (provider abstraction); *Architecture Bible* §12, §23, §26; *Product Bible* §14, §29; *Sprint Plan* Block D |

---

## Context

The Connector Platform was specified as a bespoke SDK: one `IConnector` contract with per-vendor implementations, three sprints to build the SDK and the first connector, and a fast-follow set of four more. That was a reasonable plan when written.

The ground moved. As of mid-2026 the Model Context Protocol has **10,000+ public servers and 1,000+ live connectors**, is adopted by Anthropic, Microsoft, Google, OpenAI, Amazon, Salesforce, and Databricks, and is running in production at 28–41% of surveyed enterprises. It is no longer an emerging standard to watch; it is the installed base for tool-to-model integration.

Building bespoke API glue for five systems while a thousand connectors exist behind one protocol is spending the scarcest resource on the least differentiated work — particularly for a single-engineer team where every sprint is a real trade.

## Decision

**`IConnector` is implemented primarily as an MCP host.** The platform speaks MCP to reach source systems, and implements natively behind the same interface only where no usable MCP server exists or where we need behaviour a server does not expose.

### What we stop owning

Per-vendor API clients, pagination quirks, per-vendor rate-limit handling, endpoint drift. This was never the differentiator.

### What we continue to own — the SDK's actual value

| Concern | Why it stays ours |
|---|---|
| OAuth flows and **encrypted token custody** | Customer credentials are our security obligation, never delegated |
| **Tenancy propagation and enforcement** | Tenant scope is enforced on our side. An MCP server is never trusted to isolate tenants |
| Sync scheduling, cursors, incremental state | Sync reliability is a product promise (Epic 5 acceptance criteria) |
| Retry, back-off, dead-lettering, alerting | Connector failures must retry and alert regardless of transport |
| Normalisation into the ingestion content model | Retrieval quality depends on consistent normalisation across sources |
| Connector health surfacing | "Users can see connector health at all times" is a product requirement |

## Consequences

### Positive

- **Connector reach goes from a roadmap to a protocol.** The fast-follow set stops being four sprints of work.
- **Consistent with the layer thesis.** An MCP host that is also model-agnostic (§12.2) is literally the position the platform claims: any tool plugs into us, any model plugs into us. This makes "the intelligence layer above the stack" a technical fact rather than a slogan.
- **Architecturally clean.** `IConnector` is a provider abstraction; an MCP host is one implementation behind it. Nothing about §12 changes.
- **Reversible per connector.** A source that turns out to need native treatment gets it, behind the same interface, without disturbing the others.

### Negative — accepted, with required mitigation

1. **Third-party MCP servers are untrusted code.** Mitigation is mandatory: least-privilege execution, declared scopes reviewed before enablement, network egress constrained.
2. **MCP server output is untrusted input at the prompt boundary.** This is a prompt-injection surface (§26). Content retrieved through a server is data, never instruction, and must be handled as such in the Context Builder.
3. **Server quality varies and is outside our control.** Where a server is unmaintained or wrong, we implement natively. Connector-level tests (Epic 5) catch this regardless of transport.
4. **Protocol dependency.** MCP is evolving. Mitigated by the interface: if the protocol moves badly, native implementations remain legal behind `IConnector`.

### Neutral

- The catalog order (GitHub → Slack, Gmail, Drive, Notion → …) is unchanged. The constraint on connector rollout was never the integration work — it is the normalisation and retrieval-quality work each new source requires, and that is unaffected.

## Compliance

Per *Architecture Bible* §39: module boundaries preserved; **provider abstraction maintained — this is a new implementation, not a new dependency in business logic**; tenant isolation explicitly retained on our side and never delegated; security standards addressed by the three mitigations above; observability unchanged (connector health, sync metrics); documented as an ADR before implementation. ✅

## Follow-up actions

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Update *Product Bible* §14 and §29 to reflect MCP as the mechanism | Product | Done |
| 2 | Define the MCP server trust and review process before the first third-party server is enabled | Engineering | Before Block D |
| 3 | Add prompt-injection handling for server-sourced content to the Context Builder | AI Engineering | With first connector |
| 4 | Re-scope the Connector Platform sprints against the reduced surface | Founders | At Block D planning |
