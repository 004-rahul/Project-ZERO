# ADR-018 — React (Vite) client-rendered SPA for the frontend

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Founders |
| **Supersedes** | The unrecorded Next.js choice in *Architecture Bible* §6 |
| **Related** | ADR-04 (polyglot split), *Architecture Bible* §5, §24, §39; *Engineering Playbook* §4; *Experience & Design Bible* §15.3, §19.4, §25 |

---

## Context

The frontend framework was never an architecture decision. Next.js appeared in
the *Architecture Bible* §6 technology stack table, in the repository structure,
and in the Developer Guide — but no ADR ever recorded why, what alternatives
were weighed, or what the platform gave up in exchange. Under §39 governance
("every significant architectural decision documented as an ADR before
implementation") that was a gap, not a decision.

Three facts shape the choice:

1. **The frontend is a pure API client.** Per the *Developer Guide* §1 and
   *Architecture Bible* §5, the browser talks only to the .NET API. The frontend
   holds no database credentials, no AI credentials, and no business rules. It
   has no legitimate need for a server runtime of its own.
2. **Next.js's main advantages are server-side ones.** SSR, SSG, server
   components, route handlers, and image optimisation are the reasons to pay
   for Next.js. A frontend that is forbidden from holding secrets or talking to
   the database cannot use most of them.
3. **A second server runtime is a second operational surface.** A Node server in
   front of the .NET API means another container, another health check, another
   scaling axis, another dependency-vulnerability stream, and another hop for
   correlation IDs to survive — against an API-First architecture that already
   has exactly one front door.

## Decision

**The frontend is a React 18 single-page application built with Vite,
client-rendered, served as static assets.**

| Concern | Choice |
|---|---|
| Framework | React 18 |
| Build tool / dev server | Vite (dev server pinned to `:3000`) |
| Language | TypeScript |
| Routing | React Router |
| Styling | Tailwind CSS, driven by *Experience & Design Bible* tokens |
| Motion | Framer Motion |
| 3D / WebGL identity | react-three-fiber, lazy-loaded and excluded from the initial bundle |
| Client env vars | `VITE_`-prefixed only (`VITE_API_BASE_URL`) |
| Deployment | Static bundle behind a CDN or the ingress; no Node runtime in production |

Next.js, Remix, and Angular were the alternatives considered. Remix carries the
same server-runtime cost as Next.js for the same unusable server benefits.
Angular was rejected on ecosystem fit — the Design Bible's motion and WebGL
requirements are React-native territory.

## Consequences

### Positive

- **One server in the architecture.** The .NET API remains the only backend
  process; the frontend deploys as static files. Fewer containers, fewer health
  checks, one less runtime to patch.
- **Honest API-First enforcement.** With no server-side data fetching available,
  every piece of data the UI shows must come through a documented, versioned
  `/api/v1` endpoint. The architecture rule enforces itself.
- **Faster local loop.** Vite's dev server and HMR are materially quicker than a
  Next.js dev build, and the frontend still boots with nothing else running.
- **Simpler mental model** for the small team the *Engineering Playbook* §2
  assumes: no server/client component boundary to reason about, no dual
  execution context.

### Negative — accepted, with required mitigation

1. **No server-rendered SEO on the public landing.** This is the real cost. The
   go-to-market motion in *Foundation & Strategy* §19.3 is free-first,
   land-and-expand, which depends on organic discovery. A client-rendered
   landing page is a genuine disadvantage there.
   **Required mitigation before public launch (Block G):** pre-render the
   public marketing routes to static HTML at build time (e.g. `vite-plugin-ssg`
   or an equivalent prerender step), or host the landing as a separate static
   site. The authenticated product needs no SEO and stays a pure SPA. *This is
   not optional — it is a launch gate, tracked as technical debt TD-8.*
2. **Slower first contentful paint** on the landing until mitigation 1 lands.
   The *Design Bible* §15.3 performance budget (transform/opacity only, WebGL
   idle-loaded and out of first-load JS) becomes more important, not less.
3. **Meta tags and social cards** must be handled by the prerender step; they
   cannot be set per-route at runtime for crawlers that do not execute JS.
4. **No framework-provided image optimisation.** Handle explicitly: responsive
   `srcset`, correct dimensions to avoid layout shift (*Design Bible* §28).

### Neutral

- Tailwind, Framer Motion, react-three-fiber, and the entire design-token
  pipeline are framework-agnostic React and carry over unchanged.
- The port stays `:3000` (Vite defaults to `:5173`; it is pinned so the ports
  table, CORS allow-list, and every document agree).
- The env-var prefix changes from `NEXT_PUBLIC_` to `VITE_`. Both expose values
  publicly in the bundle; neither may ever hold a secret.

## Compliance

Per *Architecture Bible* §39, this decision:

1. Preserves module boundaries — frontend/backend seam is unchanged.
2. Maintains provider abstraction — no vendor coupling introduced.
3. Protects tenant isolation — unaffected; tenancy is enforced server-side.
4. Follows security standards — reduces surface by removing a server runtime;
   no secret may ever reach the client bundle.
5. Includes observability — the frontend continues to echo `X-Correlation-Id`.
6. Is documented as an ADR before implementation. ✅

## Follow-up actions

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Add **TD-8** (landing prerender for SEO) to the *Roadmap* §15 register | Founders | Done |
| 2 | Pin Vite dev server to `:3000`; add CORS allow-list entry | Engineering | Sprint 1 |
| 3 | Add the prerender/static-landing step to the CI build | Engineering | Block G |
| 4 | Confirm the landing bundle meets the §15.3 performance budget | Design/Engineering | Block G |
