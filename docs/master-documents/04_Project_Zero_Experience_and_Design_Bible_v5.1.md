# Project Zero — Experience & Design Bible

| | |
|---|---|
| **Document** | Project Zero Experience & Design Bible |
| **Document Number** | 04 of 07 |
| **Version** | **5.1** |
| **Status** | Master Document — Single Source of Truth |
| **Owner** | Design (Founders / Design Lead) |
| **Audience** | Designers, frontend engineers, product managers, accessibility reviewers, brand/marketing |
| **Supersedes** | Project_Zero_Design_System_v1.0 (Parts 1–5), Design System md drafts (particle AI / mission control), Experience & Motion Design Specification v1.0, Conversation Summary (UI direction), Experience & Design Bible v2.0 |

---

## Revision History

*Ordered newest first. Prior to this consolidation the table was out of
sequence (5.0 was listed above 4.2/4.1/4.0/3.5), the header claimed 3.2, the
filename claimed 3.1, and the footer claimed 3.0 — four different answers to
"which version is this?". Every historical row is preserved below; only the
ordering and the version metadata were corrected.*

| Version | Description |
|---|---|
| **5.1** | **This document — consolidation, not redesign.** No design decision is changed. Four defects fixed: (1) the version was stated four different ways — now 5.0 lineage, single source; (2) §9/§10 still published the retired **Zoned Graphite** palette as canonical while the product had moved to **Deep Teal / Ice Cyan** — the real token values are now recorded, recovered verbatim from `tailwind.config.ts` as it stood at the last frontend commit; (3) §7.2, §25 and §29 still described the retired **Signature Face** and the two-generations-dead **deep-space palette** — brought in line with the §7.1 never-figurative rule and the live theme; (4) §11/§13/§15 were missing the type steps, elevation model and motion tokens the implementation actually used. Additive throughout. 2026-08-15. |
| 0.x | UI direction notes: inspired by Linear, Stripe, GitHub, Vercel, ChatGPT; enterprise-first; dark-first; decisions over dashboards. |
| 1.0 | Design System v1.0 (tokens, components, accessibility, governance) and the Experience & Motion Design Specification v1.0 (deep-space identity, particle AI, motion language). |
| 2.0 | First consolidated Experience & Design Bible. |
| 3.0 | Full enterprise rewrite merging the design system, motion specification, AI-identity concept, UI direction, and all experience requirements into one canonical design reference — including exact color values, AI state mappings, and component standards. |
| 3.1 | Founder-approved theme revision: the deep-space dark theme is replaced by the **Zoned Graphite theme** (dark graphite chrome, light workspace canvas, Violet `#7C3AED` accent); the AI identity is finalized as the **Signature Face** (geometric android particle mask — not human, not cartoon); industry-standard typography scale confirmed (Inter only); auth screens bound by the **anonymity rule** (no personalized content pre-authentication); public landing experience specified (§19.4). Approved via interactive design previews, 2026-07-20. |
| 3.2 | Public landing experience redesigned (§19.4 rewritten). The generic marketing-template structure is replaced by the **Organism landing**: one continuous particle system that morphs through the product story as the hero, a **left-aligned** impact headline, an **in-page live demo** (try before connecting anything — the founder-identified adoption barrier), and a landing-scoped **Aurora palette** (iridescent violet `#C084FC` → magenta `#E45FBC` → amber `#F2A65A` on near-black `#080709`) selected via comparative color R&D (Ember / Orchid / Aurora previews). Glossy 3D material language (specular edges, sheen sweeps, tilt depth). Product interior keeps the v3.1 Zoned Graphite identity. Approved via interactive design previews (concepts 1–9), 2026-08-02. |
| 5.0 | Landing specification CLEARED (§19.4). Every prior "redesign from scratch" complied with the written prescription in that section and so reproduced the same page; the specification itself was the blocker. Section 19.4 now records only the non-stylistic constraints (anonymity, accessibility, performance, copy ownership) and explicitly specifies no layout, grid, type scale, ornament or motion vocabulary. Theme remains Deep Teal / Ice Cyan. All landing section components and the UI kit were deleted alongside it. 2026-08-15. |
| 4.3 | **Theme replaced: Zoned Graphite retired, Deep Teal / Ice Cyan adopted.** The interface becomes dark-first and elevated — base `#0D1719` rather than near-black, so surfaces separate by lightness instead of relying on heavy borders. Ice Cyan `#3DDBD9` replaces Violet `#7C3AED` as the single accent. Token *names* are deliberately unchanged (`cream` is the page, `card` is a surface, `ink` is primary text) so the product re-themes from one file rather than section by section; their *values* carry the theme. Canonical values in §10. *(This row is reconstructed in v5.1: the theme change shipped in commit `b1759b1` on 2026-08-15 but was never given a revision entry, which is how §9/§10 kept publishing the retired palette. Dated from the commit.)* 2026-08-15. |
| 4.2 | AI identity re-founded again after founder review scored the voxel profile head −10 (“looks like a cartoon”). **Binding rule added: the identity is never figurative.** Tracing a recognisable object — a face, a brain, a head — in points or lines reads as clip art at any density, and three successive attempts failed the same way. The premium quality in the founder's references comes from *volume, depth and light*, not from resemblance. The identity is now **MindCore**: an abstract volumetric intelligence core in WebGL (~29k GPU points, two draw calls, hand-written GLSL) — a hot nucleus, a coherent accretion vortex drawing data inward, a sparse cold atmosphere, and a crisp counter-rotating ring that **holds through the entire cycle** so a designed element is always on screen. Palette unchanged. 2026-08-03. |
| 4.1 | AI identity re-founded (§7 rewritten). The geometric android **Signature Face** is retired outright — a face on a public surface read as a mascot and was rejected in founder review. The identity is now **The Zero Mind**: a human head in profile built from emissive voxels, the cerebrum glowing inside the cranium, a spine of light into the shoulders, and a signature **halo ring** through the head at brow level with lens flares at both extremes. Colour runs the existing ramp along the axis of thought — cyan at the occiput where raw data arrives, magenta at the face where it becomes an answer, gold synapses. Its lifecycle carries the founder's own thesis: scattered drift (an organisation's data is a mess) → slow gather → work → dissolve. Built from founder references `Demos/SS/Identity-1…4`; geometry verified against real profile proportion by offline rasterisation before shipping. State-bearing duties stay with the **Zero Orb** (§7.3). Palette unchanged. *(Superseded by 4.2 — retained as the record of why the never-figurative rule exists.)* 2026-08-03. |
| 4.0 | Landing rebuilt from scratch as a **senior-craft, motion-led composition** (§19.4 replaced). Palette, brand and copy unchanged by instruction; layout, motion and interaction fully re-authored. Adds a modular motion system (`primitives.tsx`: Reveal, Stagger, MaskLines, Parallax, SpotlightCard, Magnetic, Ticker, Marquee, DragRail, pointer-depth), a **React Three Fiber** Knowledge Lattice (light + dark tones, idle-loaded, desktop-only, excluded from first-load JS), and the **Answer Engine** — one product-surface component driving both the auto-playing hero visual and the visitor-driven demo. Composition is a tonal arc (light hero → graphite proof → light bento → pinned scroll-scrub → pricing → drag rail → split FAQ → graphite finale). *(Composition superseded by 5.0's clearing of §19.4; the motion primitives and Answer Engine concept remain valid reference.)* 2026-08-03. |
| 3.5 | Landing switched to the **light, screenshot-led language** (founder direction, referencing lindy.ai / glean.com): white and soft-gray alternating bands, ink text, the product's own Violet `#7C3AED` accent (landing rejoins the §10 identity — Aurora dark retired), soft card shadows, pastel washes, large centered hero with the product window as the visual. Custom cursor removed. 2026-08-02. |
| 3.4 | Particle organism retired from the landing after screenshot review; hero visual becomes the **self-running product showcase window** (typing question → evidence chips → streaming answer → confidence stamp, looping). Layout made fluid (5vw padding, fills any monitor, mobile-first stacking); vendor names in marketing copy replaced by generic integration categories with a "See all integrations" affordance. 2026-08-02. |
| 3.3 | Landing brought under a founder-supplied structured brief. **Structure list superseded and cleared in v5.0 — see §19.4. The layout details formerly recorded in this row are void and must not be used as a specification.** 2026-08-02. |

---

## Table of Contents

1. [Purpose, Scope, and Audience](#1-purpose-scope-and-audience)
2. [Design Vision](#2-design-vision)
3. [Experience Philosophy](#3-experience-philosophy)
4. [Emotional Goals](#4-emotional-goals)
5. [Brand Identity](#5-brand-identity)
6. [Design Principles and Goals](#6-design-principles-and-goals)
7. [The AI Identity — Particle Intelligence](#7-the-ai-identity--particle-intelligence)
8. [The Mission Control Workspace](#8-the-mission-control-workspace)
9. [Design Language — Deep Teal Theme](#9-design-language--deep-teal-theme)
10. [Color System](#10-color-system)
11. [Typography](#11-typography)
12. [Design Tokens](#12-design-tokens)
13. [Spacing, Grid, Radius, and Elevation](#13-spacing-grid-radius-and-elevation)
14. [Iconography and Illustration](#14-iconography-and-illustration)
15. [Motion System](#15-motion-system)
16. [Micro-Interactions](#16-micro-interactions)
17. [Component Library](#17-component-library)
18. [Navigation and Information Architecture](#18-navigation-and-information-architecture)
19. [Key Experiences](#19-key-experiences)
20. [AI Experience Guidelines](#20-ai-experience-guidelines)
21. [Dashboard Design](#21-dashboard-design)
22. [Supported Content Experience](#22-supported-content-experience)
23. [Onboarding and the Zero State](#23-onboarding-and-the-zero-state)
24. [Responsive Design](#24-responsive-design)
25. [Accessibility](#25-accessibility)
26. [Design Governance](#26-design-governance)
27. [Component Lifecycle and Documentation Standards](#27-component-lifecycle-and-documentation-standards)
28. [Quality Standards](#28-quality-standards)
29. [Inspiration and Success Criteria](#29-inspiration-and-success-criteria)
30. [Future Experience](#30-future-experience)
31. [References](#references)

---

## 1. Purpose, Scope, and Audience

### 1.1 Purpose

This document defines how Project Zero looks, feels, moves, and communicates — the complete experiential specification of the platform. It merges the design system (tokens, components, standards) with the experience and motion specification (identity, emotion, animation) so that every interface decision, from a button's hover state to the AI's visual presence, has one authoritative source.

### 1.2 Scope

**In scope:** UX philosophy; UI standards; design language; brand; typography; spacing; color system; motion and animation; the particle AI identity; design tokens; accessibility; layouts and responsive design; interaction design; the component library; micro-interactions; illustrations and icons; dashboards; content-viewing experiences; onboarding/zero states; design governance.

**Out of scope:** what features exist (*Product Bible*); how the frontend is architected technically (*Architecture Bible*; *Engineering Playbook* for code standards).

### 1.3 Audience

Designers own this document. Frontend engineers implement against it. Product managers use it to understand experiential requirements. Accessibility reviewers audit against Section 25.

---

## 2. Design Vision

Project Zero is **not** designed as a traditional CRUD application, a SaaS admin panel, or a dashboard full of charts. It is an **Enterprise Intelligence Operating System** with a **Mission Control experience**: users interact with a living intelligence platform, not a set of disconnected screens.

Every interface must communicate four things simultaneously: **confidence, clarity, trust, and intelligence**. The interface must help users *understand* information, never merely display it. The product should feel **alive, premium, cinematic, calm, intelligent, and trustworthy** — and never like a generic admin dashboard.

---

## 3. Experience Philosophy

Permanent experiential principles, each binding on every surface:

1. **Mission Control over administration panels.** The user is supervising an intelligent system, not filling out forms. Screens orient around state, activity, and decisions — not tables of records.
2. **Meaningful motion over decorative animation.** Motion exists to explain system behavior (Section 15). If an animation explains nothing, it does not ship.
3. **Intelligence over visual clutter.** Fewer, smarter elements. Information density serves comprehension, not decoration.
4. **Progressive disclosure.** Complexity reveals itself as needed; no overwhelming screens.
5. **Consistency across every module.** One design language everywhere — the platform must feel like one mind built it.
6. **Accessibility by default.** Not a compliance afterthought (Section 25).
7. **Enterprise-grade usability.** Suitable for long working sessions: restrained contrast, calm surfaces, predictable interactions.
8. **Focus on actions and decisions instead of dashboards full of charts.** The founding UI direction — the product surfaces *what needs attention and what to do*, not vanity metrics.

---

## 4. Emotional Goals

The experience must evoke: **confidence** (the system knows what it's doing), **clarity** (I understand what's happening), **trust** (I can verify everything), **intelligence** (this platform is genuinely smart), and **momentum** (work is moving forward). The explicit anti-goal: generic admin-dashboard aesthetics.

---

## 5. Brand Identity

The visual identity represents **trust, intelligence, precision, and enterprise reliability**. The platform should appear modern without chasing design trends — built for a 10-year documentation horizon, the brand must age well.

Identity pillars: **an elevated dark-teal ground with depth carried by surface lightness; premium typography; restrained color usage; purposeful motion.** Together they create a professional environment suitable for long working sessions. White space, typography, spacing, and alignment are the primary design tools; color and motion are reserved for meaning (state, focus, feedback).

---

## 6. Design Principles and Goals

**Principles:** simplicity over complexity; consistency across products; accessibility by default; performance-first interfaces; AI-first user experience; responsive layouts; reusable components; clear visual hierarchy; minimal cognitive load; enterprise-grade usability.

**Goals:** unified user experience; scalable component library; consistent branding; faster product development; improved accessibility; cross-platform compatibility (web now; desktop and mobile futures share this language).

---

## 7. The AI Identity — Particle Intelligence

### 7.1 MindCore — the brand identity

**BINDING RULE — the identity is never figurative.** No face, no head, no brain, no body, no recognisable object. Three attempts broke this rule (an android particle mask, an anatomical brain, a voxel human profile) and all three were rejected in founder review for the same reason: a traced literal form reads as clip art no matter how dense or how well coloured it is. The premium quality in the reference material (`Demos/SS/Identity-1–4`) comes from **volume, depth and light** — those are the qualities to reproduce, not the subject matter. Resemblance is not the goal; presence is.

The identity is **MindCore** (`landing/three/mind-core.tsx`): an abstract volumetric intelligence core rendered in **WebGL**, ~29k GPU points in two draw calls driven by a hand-written GLSL shader. Canvas 2D is not sufficient — flat dots cannot produce volume.

Its four elements, and why each exists:

| Element | Form | Purpose |
|---|---|---|
| **Nucleus** | ~7.2k points, radius 0.28, density biased hard inward, white-hot centre | The resolved answer. Small and intense — a large soft core reads as a smudge. |
| **Accretion vortex** | 20 filaments, all winding the **same** direction, flattening toward the ring plane as they fall in | The inflow. Mixed directions read as floating debris; one direction reads as designed. |
| **Atmosphere** | ~3.6k dim points on an outer Fibonacci shell | Depth and scale. Kept sparse — a dense shell turns the whole thing into a fuzzy ball. |
| **Ring** | ~6.4k points, narrow bright annulus, counter-rotating | The one crisp graphic edge; the silhouette hangs off it. **It never scatters.** |

Shader craft that carries the premium read: perspective size attenuation, **depth fog** (this is what makes it volumetric rather than flat), additive radial falloff for bloom with no postprocessing pass, staggered per-particle convergence so the field arrives as a wave, and light racing the filaments inward.

**Lifecycle** — the founder's thesis unchanged: scattered → drawn inward → working → released. Two rules govern it:

- **The ring holds through every phase.** There is always one intentional element on screen, so the scattered state reads as data waiting to be gathered rather than as an unfinished effect.
- **The scattered state is clumped, never uniform.** Uniform random points render as television static. Clumps read as scattered sources. The scatter volume also stays close to the formed extent — the panel must never fill edge-to-edge with dust.

The resolved core holds ~65% of the cycle: it is the identity, so it owns the screen.

Composition is **fit to the tighter viewport axis** — the auth panel is portrait, and without that scale the outer field is cropped by the left and right edges.

Verification requirement: **the identity is looked at before it ships.** Geometry and shader output are reproduced offline and rendered to an image in the formed, converging and scattered states. Reasoning about particle maths is not review — every rejection in this component's history was visible in one frame.

### 7.2 AI States

Seven canonical states, each with a distinct motion signature and mapped colour (Section 10.5). States are carried by the **Zero Orb** (§7.3), not by MindCore — a state-switching face would be expression, and expression is what got the android face retired.

**These descriptions were rewritten in v5.1.** They previously described a face forming and dissolving, eyes igniting, and a mouth line shimmering — the retired Signature Face. That wording survived §7.1's never-figurative rule and would have led any implementer straight back into the component that was rejected three times. The state *semantics* are unchanged; only the figurative vocabulary is gone.

| State | When | Visual Behavior |
|---|---|---|
| **Idle** | No active task | Orb dispersed — loose constellation drift, low luminance; neutral `faint` |
| **Listening** | User is typing/speaking | Orb coheres; core brightens to `accent`; attentive stillness, no drift |
| **Thinking** | Reasoning in progress | Cohered orb; concentrated inward swirl; `thinking` hue |
| **Researching** | Retrieval/knowledge search running | Orb disperses outward — filaments trace searching paths; `knowledge` hue, dimmed |
| **Speaking** | Response streaming | Cohered orb; core pulses rhythmically in time with token output; `accent` |
| **Warning** | Attention needed | Cohered orb; `warning` hue; motion sharpens and shortens |
| **Success** | Task completed | Orb settles and steadies; `success` hue; motion calms to rest |

**Rules binding on all seven:** no facial features, no anatomy, no anthropomorphic gesture (§7.1); every state has a `prefers-reduced-motion` equivalent that conveys the same information through colour and a static form (§25); and the state shown must be the state the pipeline is actually in — a decorative animation that does not track real system state violates §15.1.

**Future:** collaborative multi-agent visualizations — multiple particle entities coordinating — reserved for the multi-agent roadmap.

### 7.3 Usage Rules — two expressions, one identity

The identity has exactly two renderings, and they do not overlap:

| | **MindCore** (`three/mind-core.tsx`) | **The Zero Orb** (`ai-orb.tsx`) |
|---|---|---|
| Role | The brand identity — who Zero *is* | The working presence — what Zero is *doing* |
| Where | Login and registration panels | Landing surfaces, and beside AI responses in the workspace |
| Carries | The data-mess → central-mind thesis | The seven canonical states (§7.2) |
| Form | Abstract volumetric core, WebGL | Abstract; no face, no anatomy |

Rules that bind both: **neither may be figurative** (§7.1); it appears only where the platform itself is acting, never as decoration on a static screen; it never becomes a mascot — no anthropomorphic gimmicks, no idle chatter; and it never renders anything personalized on an auth surface (§19.1 anonymity rule). Every animation path has a `prefers-reduced-motion` equivalent.

The landing's orb treatment is **founder-approved and frozen** — changes to the AI presence apply to the auth surfaces unless the founder says otherwise.

---

## 8. The Mission Control Workspace

The workspace is the center of the product. Instead of isolated pages, it combines **AI conversations, evidence, knowledge exploration, decision briefs, tasks, timelines, connector status, and organizational context into one continuous intelligence environment.**

Requirements:

- **Minimal context switching.** The primary working loop (ask → evidence → decide) never requires leaving the workspace.
- **Users supervise an AI workforce through one unified intelligence interface** — the workspace is where supervision happens: what the AI is doing, what it found, what it recommends, what needs approval.
- **Layered panels, not page navigation**, for evidence, sources, and detail views (progressive disclosure).

---

## 9. Design Language — Deep Teal Theme

The interface is **dark-first and deliberately elevated**. The base is `#0D1719` — not near-black — so surfaces above it separate **by lightness alone** and hairlines can be used for structure rather than to prop up contrast. Zones remain the organising idea: distinct surfaces make the product's structure legible at a glance.

| Zone | Surface | Color |
|---|---|---|
| Header | Chrome, deepest | `#0A1315` |
| Sidebar / navigation | Chrome panel | `#101B1E` |
| Workspace canvas | Page base | `#0D1719` |
| Surfaces / cards | Surface, +1 step | `#142225` |
| Raised / hover / nav | Surface, +2 steps | `#1C2E32` |
| Footer / status bar | Deepest chrome | `#081113` |
| Void | Below-base wells | `#060E10` |

Visual identity elements: **an elevation ladder rather than borders, calm desaturated teal surfaces, two hairline weights (§10.3), premium typography, purposeful whitespace.** The Ice Cyan accent is reserved exclusively for **interaction, active states, focus, and the AI presence** — never ambient decoration.

**The token-naming rule (binding).** Token *names* survive theme changes; only their *values* change. `cream` is the page base, `card` is a surface, `ink` is primary text — regardless of whether the theme is light or dark. This is why the product re-themes from one file instead of section by section, and it is the reason a future theme change costs hours rather than weeks. Do not rename tokens to describe their current colour.

### 9.1 Theme Decision Record

| Date | Change | Reasoning |
|---|---|---|
| 2026-07-20 | "Deep-space layered dark" (v3.0) → **Zoned Graphite** | Founder decision after interactive preview review. Deep blues, emerald/gold, and full-dark canvases were explicitly rejected in favour of a neutral, industry-standard premium system. |
| 2026-08-15 | **Zoned Graphite → Deep Teal / Ice Cyan** (commit `b1759b1`) | Founder decision. The light workspace canvas fought the product's own subject matter — an intelligence surface reading evidence and confidence wants a calm dark ground. Base lifted off black to `#0D1719` so elevation can carry hierarchy. Violet `#7C3AED` → Ice Cyan `#3DDBD9`. |

*Both prior palettes are retired. Any surviving reference to Graphite, Violet `#7C3AED`, or the deep-space palette elsewhere in the documentation set is a defect — report it.*

---

## 10. Color System

*These are the canonical values. They are mirrored in code by
`frontend/tailwind.config.ts`, which is the single source of truth for
implementation — if the two ever disagree, the config is right and this section
is a defect to be fixed in the same PR (§26 governance).*

### 10.1 Surface and Elevation Ladder (Canonical Values)

Surfaces separate by **lightness**, not by border weight. Each step up the
ladder is a lighter teal-neutral; hairlines then carry structure rather than
contrast.

| Token | Hex | Use |
|---|---|---|
| `zone.header` | `#0A1315` | Top header bar — chrome, deepest |
| `zone.sidebar` | `#101B1E` | Left navigation |
| `zone.canvas` | `#0D1719` | Main workspace background |
| `zone.footer` | `#081113` | Footer / status bar |
| `cream` | `#0D1719` | Page base (name preserved from the light theme — §9) |
| `card` | `#142225` | Cards, panels, chat bubbles — one step above base |
| `raised` | `#1C2E32` | Hover, active nav, popovers — two steps above base |
| `void` | `#060E10` | Wells and insets that must sit *below* the base |

### 10.2 Text Palette (Canonical Values)

| Token | Hex | Use |
|---|---|---|
| `ink` | `#EAF2F2` | Primary text (near-white — the theme is dark-first) |
| `muted` | `#8FA3A6` | Secondary text, labels |
| `faint` | `#6B8085` | Tertiary text, timestamps, disabled |
| `on-dark` | `#EAF2F2` | Text on chrome zones |
| `on-dark-muted` | `#8FA3A6` | Secondary text on chrome zones |

### 10.3 Hairlines — Two Weights, and Why

There are **two** hairline tokens, split deliberately by WCAG 2.2 SC 1.4.11
(Non-text Contrast). Using one weight for both purposes either fails the audit
or makes every divider look like a wireframe.

| Token | Hex | Use | Contrast obligation |
|---|---|---|---|
| `line` | `#314E53` | **Decorative** — dividers, page grid, section rules | Exempt from the 3:1 non-text minimum |
| `line-strong` | `#4F7A82` | **Interactive bounds** — cards, inputs, secondary buttons | Must clear 3:1 against both `cream` and `card` |

Choosing `line` for an interactive control's border is an accessibility defect,
not a style preference.

### 10.4 Accent and Semantic Palette (Canonical Values)

| Token | Hex | Meaning |
|---|---|---|
| `accent` | `#3DDBD9` (Ice Cyan) | Primary actions, active navigation, focus, AI presence |
| `accent.strong` | `#2BB8B6` | Hover / pressed accent |
| `accent.bright` | `#7CEDEB` | Accent on the deepest chrome; highlight particles |
| `second` | `#7C9EFF` | Secondary hue — **never a second CTA colour**; only to separate one data channel from another |
| `second.soft` | `#A9BEFF` | Lighter step of the secondary hue |
| `thinking` | `#7C9EFF` | Reasoning in progress |
| `knowledge` | `#3DDBD9` | Knowledge, sources, retrieval, citations |
| `knowledge.dark` | `#7CEDEB` | Knowledge on the deepest surfaces |
| `success` | `#34D399` | Success, completion, approval |
| `warning` | `#FBBF24` | Warnings, attention |
| `danger` | `#F87171` | Errors, failures, rejection |

### 10.5 Accent-to-State Mapping

One Ice Cyan accent carries all interaction; semantic colours carry state —
colour is never decorative. The AI presence (the Zero Orb, §7.3) maps to state
through its **core luminance and halo hue**, never through facial features:

| State | Colour |
|---|---|
| Idle | neutral `faint` `#6B8085` |
| Listening · Speaking | `accent` `#3DDBD9` |
| Thinking | `thinking` `#7C9EFF` |
| Researching | `knowledge` `#3DDBD9`, dimmed and dispersed |
| Success | `success` `#34D399` |
| Warning | `warning` `#FBBF24` |
| Error | `danger` `#F87171` |

### 10.6 Token Scales

The token system defines full scales for systematic use: **Accent (base / strong / bright)**, **Surface (void → canvas → card → raised)**, **Text (ink / muted / faint)**, and **Semantic (success, warning, danger, thinking, knowledge)**. Steps map onto the canonical values above. New shades require a token, not a hex literal.

### 10.7 The Color Rule

**Color alone must never communicate critical information.** Icons, labels, and motion reinforce meaning in every state indication (accessibility requirement, Section 25).

---

## 11. Typography

- **Font family:** **Inter**. Fallback stack: `-apple-system`, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif.
- **Weights:** 400 / 500 / 600 / 700. Tabular numerals for metrics, prices, and any aligned figures.

### 11.1 Type Scale (Canonical)

*The four display steps below (`3xl`, `4xl`, `hero`) were used by the implementation but were missing from this document, which stopped at 28px. Recorded in v5.1.*

| Token | Size | Line height | Letter-spacing | Use |
|---|---|---|---|---|
| `2xs` | 11px | 16px | — | Micro-labels, badge text |
| `xs` | 12px | 18px | — | Captions, metadata |
| `sm` | 13px | 20px | — | Secondary UI text |
| **`base`** | **14px** | **22px** | — | **Body — the product's default** |
| `md` | 16px | 24px | — | Emphasised body, lead paragraphs |
| `lg` | 18px | 27px | — | Section subheads |
| `xl` | 22px | 30px | — | Card and panel titles |
| `2xl` | 28px | 36px | −0.02em | Page titles |
| `3xl` | 36px | 42px | −0.025em | Major headings |
| `4xl` | 52px | 56px | −0.03em | Display headings |
| `hero` | `clamp(36px, 6.2vw, 88px)` | 1.05 | −0.04em | Landing hero only — fluid by viewport |

Tight letter-spacing applies to headings only (`2xl` and above); body text keeps
default tracking for legibility in long sessions.
- **Character:** premium, restrained, highly legible across the full surface ladder — from `void` `#060E10` through `raised` `#1C2E32` (§10.1); generous line height for long sessions; responsive typography scales with breakpoints (Section 24). Single family — no decorative or serif typefaces.
- **Dark-theme weight rule:** light text on dark surfaces optically thickens. Prefer weight 400–500 for body on the Deep Teal ground where a light theme would have used 500–600; reserve 600–700 for headings and emphasis. Over-bolding is the most common way a dark UI starts to feel heavy.
- Typography is a primary design tool (Section 5): hierarchy is achieved through scale and weight before color or decoration.

---

## 12. Design Tokens

Every visual property in the product resolves to a token — color (Section 10), typography (Section 11), spacing, radius, elevation (Section 13), motion durations/easings (Section 15). Rules:

1. **Every UI change must use approved design tokens** (governance rule — Section 26).
2. Tokens are the single bridge between design and code. **In code the single source of truth is `frontend/tailwind.config.ts`**; a small set of CSS custom properties in `frontend/src/styles/globals.css` mirrors the accent, zone, and line values for the few places Tailwind utilities cannot reach (canvas gradients, scrollbars, selection).
3. **Hard-coded values in components are defects.** This includes hex literals, pixel sizes outside the spacing scale, and inline `cubic-bezier` values.
4. **This document and the config must agree.** If they diverge, the config is authoritative and the document is the defect — fix it in the same PR (§26).
5. **Token names are theme-independent** (§9). Rename a token only when its *role* changes, never when its colour does.

---

## 13. Spacing, Grid, Radius, and Elevation

**Spacing.** Base unit **4px**; scale: **4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96**. Use consistent spacing throughout layouts and components — spacing is rhythm, and rhythm is what makes the platform feel composed.

**Grid.** Desktop **12 columns**; tablet **8**; mobile **4**. Container widths: Small, Medium, Large, Full Width.

**Border radius (canonical).** `DEFAULT` 8px · `md` 10px · `lg` 12px · `xl` 16px · Pill · Full — applied consistently by component class (inputs share one radius; cards another).

**Elevation on a dark theme.** Elevation indicates **hierarchy and interactive depth**. The primary mechanism is the surface ladder in §10.1 — a raised element uses a lighter surface token, not a heavier shadow.

*Recorded in v5.1:* on a dark canvas **a drop shadow alone is invisible**. Depth requires a **top inset highlight** — the edge catching light — plus a deeper cast below. Without the inset, dark cards read as flat holes punched in the page. The two canonical shadow tokens:

| Token | Value | Use |
|---|---|---|
| `shadow-card` | `inset 0 1px 0 rgba(255,255,255,.045), 0 2px 8px rgba(0,0,0,.35)` | Resting cards, panels |
| `shadow-lift` | `inset 0 1px 0 rgba(255,255,255,.07), 0 10px 34px rgba(0,0,0,.5)` | Hover / active lift — one level up |
| `shadow-accent-glow` | `0 6px 26px rgba(61,219,217,.28)` | Primary actions and the AI presence only |
| `shadow-ring` | `0 0 0 1px rgba(61,219,217,.35)` | Accent-bounded focus and selection rings |

Level jumps signal interactivity (hover lift = one level: `shadow-card` → `shadow-lift`, optionally paired with a `card` → `raised` surface step).

---

## 14. Iconography and Illustration

**Icons.** Style: **outline** primary, **filled** limited (active/selected states). Sizes: **16, 20, 24, 32, 48px**. Rules: consistent stroke width; pixel-aligned; accessible labels on meaningful icons; **decorative icons hidden from screen readers**.

**Illustration.** Restrained and purposeful: illustrations appear in empty states, onboarding, and errors — rendered in the graphite visual language (particle motifs, line work in accent and semantic colors). No stock-style decorative art.

---

## 15. Motion System

### 15.1 Purpose

**Motion exists to explain system behavior.** Every animation answers: *what is the system doing, and what changed?* Motion should always have purpose and remain performant.

### 15.2 The Motion Vocabulary

| Motion | Explains |
|---|---|
| **Particle formation/dissolution** | AI activity beginning/ending (Section 7) |
| **Knowledge graph animation** | Relationships and their discovery |
| **Workflow progress** | Long-running operations advancing |
| **Connector sync transitions** | Synchronization activity |
| **Document ingestion / retrieval transitions** | Content entering and being found |
| **Agent communication trails** | (Future) agents coordinating |
| **Fade / slide / scale / lift / blur / subtle glow** | State entrances, exits, emphasis |
| **Skeleton loading / shimmer** | Content on its way |
| **Page transitions** | Context changes — **under 400 ms** |
| **Toast animations** | Transient feedback arriving/leaving |

### 15.3 Motion Rules

1. Fast: transitions ≤ 400 ms; micro-interactions faster.
2. Purposeful: no ambient/looping decoration.
3. Reduced distraction: motion never competes with content.
4. Performance-optimized: GPU-friendly transforms; no layout-thrash animations.
5. **Reduced-motion support:** every animation has a reduced-motion alternative (Section 25).
6. **Transform and opacity only.** Animating layout properties (width, height, top, margin) is a defect — it forces a layout pass on every frame.
7. **WebGL is idle-loaded and excluded from first-load JS**, and is desktop-only. It must never block first paint.

### 15.4 Motion Tokens (Canonical)

*Recorded in v5.1 — the implementation used a consistent easing and duration set that this document never captured.*

**The signature easing is `cubic-bezier(0.16, 1, 0.3, 1)`** — a fast start settling gently. It is what makes the product's motion read as composed rather than springy, and it is the default for any interactive transition.

| Purpose | Duration | Easing |
|---|---|---|
| Icon travel (arrow leads the cursor) | 260 ms | signature |
| Surface shift / hover lift | 420 ms | signature |
| Zoom on media within a card | 620 ms | signature |
| Sheen sweep across a primary action | 720 ms | signature |
| Entrance (`fade-up`) | 800 ms | `ease` |
| Word-in (masked heading reveal) | 1000 ms | signature |
| Page transition | **< 400 ms** | signature |

Ambient loops (`glow-pulse` 6 s, `floaty` 9 s, drift 16–24 s) are permitted **only** on the AI presence and the landing hero, never in the working product — Rule 2 governs everywhere else.

**Reduced motion is implemented globally**, not per component: under `prefers-reduced-motion: reduce`, all animation and transition durations collapse to `0.01ms` and iteration counts to `1`, and the card interaction layers (`zoom`, `shift`, `travel`, `sheen`) drop their transforms entirely. A component that opts out of this global rule must document why.

---

## 16. Micro-Interactions

The canonical micro-interaction set — each tied to a user action or system state:

- **Animated sidebar indicator** — active-section marker glides between items.
- **Intelligent search placeholder** — the search field hints at real, contextual queries.
- **Soft hover glows** — interactive elements respond with restrained glow (never neon flooding).
- **Shimmer loading** — content placeholders shimmer while loading.
- **Subtle notification animations** — arrivals announce without interrupting.
- Button/input state transitions (Section 17) — hover, focus, active, loading are all animated within the motion rules.

---

## 17. Component Library

All components share consistent spacing, typography, interaction rules, and accessibility. Buttons and inputs define the interaction grammar the rest inherit.

### 17.1 Navigation
Top Navigation Bar; Side Navigation; Breadcrumbs; Tabs; Pagination.

### 17.2 Inputs
Text Field; Password Field; Text Area; Search Box; Select; Multi-Select; Checkbox; Radio Button; Toggle Switch; Date Picker; File Upload.

### 17.3 Buttons
**Variants:** Primary, Secondary, Outline, Ghost, Link, Danger. **Sizes:** Small, Medium, Large. **States:** Default, Hover, Focus, Active, Disabled, Loading — every button implements all six states; Loading uses inline progress, never a frozen UI.

### 17.4 Feedback
Alerts; Toast Notifications; Progress Indicators; Skeleton Loaders; Empty States; Error States. Empty and error states are designed content (Section 23), never blank panels or raw messages.

### 17.5 Data Display
Tables; Data Grid; Cards; Lists; Timeline; Badges; Tags; Avatars.

**Tables** support: sorting, filtering, pagination, column resizing, column visibility, row selection, bulk actions, export.

### 17.6 Forms
Inline validation; clear labels; required indicators; helpful error messages; keyboard navigation; accessible controls; consistent spacing.

### 17.7 Overlays
Confirmation Dialog; Form Modal; Full-Screen Modal; Side Drawer; Bottom Sheet (mobile).

### 17.8 Intelligence Components (Platform-Specific)
AI chat panel; evidence cards; decision briefs; knowledge graph views; connector cards; command palette; search interface; file viewers; upload flows; audit history views; settings surfaces; dashboards (Section 21) — all composed from the primitives above and the AI experience rules (Section 20).

---

## 18. Navigation and Information Architecture

Main navigation (the canonical section set from the UI direction):

> **Dashboard · AI · Knowledge · Decisions · Connectors · Organization · Files · Notifications · Settings**

Rules: the sidebar is the persistent spine (`zone.sidebar` `#101B1E` — §10.1); the workspace (AI) is the default landing surface for members; administration surfaces (Organization, Settings) follow the same design language — Mission Control aesthetics apply even to settings; the command palette provides keyboard-first navigation across all sections.

---

## 19. Key Experiences

### 19.1 Login and Registration (Anonymous by Rule)

**Split layout: MindCore on the left (dark graphite panel), minimal authentication on the right (light).** The core (§7.1) draws scattered data inward as the visitor arrives — the first impression is the thesis of the product, not a logo.

**The anonymity rule (binding):** before authentication the platform cannot know who the user is; pre-auth surfaces must never display personalized claims, activity summaries, or user data of any kind. Auth-screen copy is generic product messaging only. Personalization begins after sign-in, when **the dashboard assembles** — panels compose into place (fast, purposeful, under the motion rules) rather than popping in.

Registration is a **three-step onboarding** — Account → Organization → Connect tools — with a visible step indicator, matching the onboarding workflow (*Product Bible* §9.2). SSO options (Google, Microsoft, GitHub) appear above the email form on both screens.

### 19.2 The AI Workspace Experience

The user-visible reasoning pipeline (a product requirement — *Product Bible* Section 12.3) is expressed experientially:

> **Question → Context → Knowledge Search → Evidence → Reasoning → Confidence → Decision Brief → Final Answer**

Each stage may surface as state (AI identity states, progress motion, evidence panels populating). The user always knows what stage the platform is in and can inspect what it found.

### 19.3 The Decision Experience

Decision Briefs present: recommendation up front; evidence cards with navigable citations; confidence displayed honestly (including *low* confidence); approve/reject controls; audit metadata (model, prompt version) available on inspection — trust through visible mechanics, not claims.

### 19.4 The Public Landing Experience — DELIBERATELY UNSPECIFIED

**Status: cleared 2026-08-15 by founder instruction. Do not restore from history.**

This section previously prescribed the landing in detail — a fixed nine-section
order, a 1400px measure, numbered mono eyebrows, hairline rules that fade at the
ends, tabular figures, banned and required layout patterns. Every subsequent
"redesign from scratch" read this section first and complied with it, so each
attempt reproduced the same page in new colours. The specification was the
reason the output would not change.

It is therefore removed rather than rewritten. **There is currently no approved
landing composition.** A future design must be derived from the founder's brief
and from fresh work, not from this document.

The only constraints that still bind the public landing are the ones that are
not stylistic:

- **§19.1 anonymity rule** — nothing personalised may render before sign-in.
- **§25 accessibility** — WCAG 2.2 AA; focus is a designed state and is never
  suppressed; every animation has a `prefers-reduced-motion` equivalent.
- **§15.3 performance budget** — transform/opacity only, WebGL idle-loaded and
  excluded from first-load JS.
- **Copy and content** are owned by a single content module (previously
  `landing/content.ts`, deleted with the landing in commit `09f9153`) and are
  preserved across redesigns unless the founder says otherwise. **The prior copy
  is recoverable from git history — recover it rather than rewriting it**, since
  the copy was approved separately from the layout that was cleared.

Nothing about layout, section order, grid, type scale, ornament or motion
vocabulary is specified here. That is intentional.

---

## 20. AI Experience Guidelines

### 20.1 AI Chat Interface Components

Conversation List; Chat Window; Prompt Input; Suggested Prompts; Source References; Confidence Indicator; Response Actions; Conversation History.

### 20.2 AI Chat Guidelines

- **Streaming responses** — output renders as it arrives (Speaking state).
- **Markdown rendering** with **syntax highlighting** for code.
- **Copy response** and **regenerate response** actions on every message.
- **Feedback controls** (approve/reject/rate) inline — feeding the learning loop.
- **Citation visibility** — sources are visible affordances on the response, one interaction away from the evidence itself; never buried.

---

## 21. Dashboard Design

### 21.1 Philosophy

The dashboard is **Mission Control** — organizational situational awareness, not chart decoration: what is the AI doing, what needs deciding, what is connected, what changed.

**The Decision Queue is the product's home screen** (*Product Bible* §12.1.1, FR-24). *Added v5.1 — this document already described Mission Control and the decision queue, then let the chat window occupy the front door in practice. That ordering produces a product visually indistinguishable from every assistant on the market, which is the outcome §29's success criterion exists to prevent.*

| | Rejected | Canonical |
|---|---|---|
| First thing the user sees | An empty prompt | Items awaiting their decision |
| Who supplies the question | The user, every time | The platform, from what changed |
| Chat's role | The product | A drill-down inside a brief |

**Design obligations that follow:**

- **An empty queue is a designed state, not a failure state.** A quiet week is honest and must read as calm and finished — never as an error, never as a nudge to go ask something. Manufacturing items to fill space destroys the trust the Trust Layer exists to build.
- **Each item is a Decision Brief**, not a notification: recommendation first, evidence cards, honest confidence including *low*, approve/dismiss (§19.3).
- **Dismissal is a first-class action with visible consequence** — the interface should make clear that dismissing teaches the system, because that is the compounding the product is sold on.
- **Recency is not relevance.** The queue is ordered by what warrants a decision, never by timestamp alone; a feed sorted by time is the pattern this design explicitly rejects.

### 21.2 Widgets

The canonical widget set (merged from all sources): **KPI Cards; Activity Feed; AI Usage; Connector Status; Knowledge Insights / Knowledge Activity; Recent Decisions / Decision Queue; Notifications; System Health / Live Platform Status; Organization Health; AI Agents.**

### 21.3 Dashboard Rules

Responsive layout; configurable widgets; real-time updates (SignalR-backed — *Architecture Bible*); consistent spacing; accessible charts (data available non-visually).

---

## 22. Supported Content Experience

The interface must present the platform's full content matrix **through a unified viewing experience**: PDFs, Word documents, spreadsheets, presentations, Markdown, HTML, JSON, XML, YAML, code repositories, images, OCR results, diagrams, screenshots, audio, meetings, speech transcripts, video summaries, databases, and organizational knowledge.

One viewer shell, format-appropriate renderers, consistent chrome: source metadata, citation anchors (evidence links jump to the exact location), and the same navigation grammar regardless of format.

---

## 23. Onboarding and the Zero State

A brand-new workspace — before any connector is linked — is a **designed experience** (the gap flagged in the pre-development checklist, closed here):

- The particle identity welcomes and orients (Idle→Listening states).
- The zero state presents the three first moves: **connect a system, upload a document, ask a question** — with suggested prompts that work even against an empty workspace.
- Empty states throughout the product teach: each explains what will appear there and how to make it happen (never a blank panel).
- Onboarding must be completable by a non-technical administrator without support (product requirement — *Product Bible* Section 9.2).

---

## 24. Responsive Design

**Breakpoints:** Mobile, Tablet, Laptop, Desktop, Ultra-wide.

**Guidelines:** mobile-first construction; fluid layouts; responsive typography; adaptive navigation (sidebar collapses; bottom sheet replaces drawers on mobile); touch-friendly controls (target sizes, gesture affordances). The design language survives every breakpoint — depth layers and semantic color behave identically on all devices.

---

## 25. Accessibility

**Compliance target: WCAG 2.2 AA. Mandatory, not optional.**

Requirements: keyboard navigation everywhere (the entire product operable without a mouse); screen reader support (semantic HTML first, ARIA labels where required); scalable typography; consistent interaction behavior; decorative icons hidden from assistive tech; colour never the sole carrier of meaning (Section 10.7); accessible charts on dashboards.

### 25.1 Contrast Obligations (Deep Teal Theme)

*Corrected in v5.1 — this section previously required "the deep-space palette" to meet AA. That palette was retired two themes ago. The obligations below apply to the live Deep Teal theme (§10).*

- **Text (SC 1.4.3, AA):** every `ink` / `muted` / `faint` pairing against every surface in the §10.1 ladder must be validated. `faint` `#6B8085` is the tightest case — it is permitted for tertiary content only, never for body text or anything a user must read to act.
- **Non-text (SC 1.4.11, AA):** interactive bounds use `line-strong` `#4F7A82`, which must clear **3:1** against both `cream` `#0D1719` and `card` `#142225`. Decorative `line` `#314E53` is exempt because it carries no information — using it on an interactive control converts an exempt element into a failing one (§10.3).
- **Focus (SC 2.4.11/2.4.13):** focus is a **designed state and is never suppressed**. The canonical treatment is `outline: 2px solid var(--accent); outline-offset: 2px` — an Ice Cyan ring with clearance so it reads against both cards and chrome.
- **Reduced motion (SC 2.3.3):** every animation has a reduced or static alternative, including the AI identity. Implemented as a global rule (§15.4), not per component.

Contrast validation runs at the component lifecycle's Accessibility Review stage (§27) and is a release gate (*Engineering Playbook* §20).

Accessibility review is a stage in the component lifecycle (Section 27) and a release gate (see *Engineering Playbook*).

---

## 26. Design Governance

1. **Every UI change must use approved design tokens.**
2. **New components must be reusable before being feature-specific.** A feature needing a new component contributes it to the library.
3. **Accessibility is mandatory, not optional.**
4. **Visual consistency takes precedence over individual preferences.**
5. **All components require documentation and usage examples** (Section 27).

---

## 27. Component Lifecycle and Documentation Standards

**Lifecycle stages:** Proposal → Design Review → Development → Accessibility Review → QA Validation → Release → Maintenance → Deprecation.

**Documentation — every component must include:** Purpose; Anatomy; Variants; States; Accessibility notes; Responsive behavior; Usage guidelines; Do & Don't examples.

**The design documentation roadmap** (carried from the founding design docs, delivered by this document and its component docs): Brand Identity; Design Tokens; Component Library; Animation Specification; AI Workspace; Intelligence Pipeline; Developer Guidelines.

---

## 28. Quality Standards

**Performance:** optimized rendering; lazy loading where appropriate; minimal layout shift; motion within performance budgets (Section 15.3).

**Accessibility:** WCAG 2.2 AA compliant; keyboard accessible; screen-reader compatible.

**Maintainability:** shared design tokens; reusable components; consistent naming conventions.

---

## 29. Inspiration and Success Criteria

**Inspiration (study, never copy):** Linear, Stripe, GitHub, Vercel, ChatGPT (product craft and enterprise clarity); Apple Vision Pro, Arc Browser, Motion.page, Incredible.dev (spatial depth, motion, and liveliness).

**The success criterion:**

> **Users should recognize Project Zero from its experience alone — even without the logo.**

The elevated deep-teal surfaces, the Ice Cyan accent, the abstract MindCore identity, the evidence-forward answers, and the calm purposeful motion together form an identity no competitor screenshot could be mistaken for.

---

## 30. Future Experience

Recorded future experience directions (sequencing in the *Roadmap*): **voice interaction; real-time collaboration; spatial knowledge graphs; 3D particle rendering / 3D particle engine; customizable AI themes and avatars; advanced visualization; immersive analytics; enterprise collaboration workspaces** — all required to preserve the same core design language defined here.

---

## References

- *Product Bible* — the features these experiences serve; AI Workspace and Trust Layer requirements.
- *Architecture Bible* — streaming, real-time (SignalR), and state infrastructure behind the motion system.
- *Engineering Playbook* — frontend code standards; accessibility and performance gates.
- *Foundation & Strategy* — the trust-first positioning this design language expresses.

---

*End of Project Zero Experience & Design Bible v5.1 — Master Document 04 of 07.*
