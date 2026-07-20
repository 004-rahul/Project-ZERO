# Project Zero — Experience & Design Bible

| | |
|---|---|
| **Document** | Project Zero Experience & Design Bible |
| **Document Number** | 04 of 06 |
| **Version** | 3.0 |
| **Status** | Master Document — Single Source of Truth |
| **Owner** | Design (Founders / Design Lead) |
| **Audience** | Designers, frontend engineers, product managers, accessibility reviewers, brand/marketing |
| **Supersedes** | Project_Zero_Design_System_v1.0 (Parts 1–5), Design System md drafts (particle AI / mission control), Experience & Motion Design Specification v1.0, Conversation Summary (UI direction), Experience & Design Bible v2.0 |

---

## Revision History

| Version | Description |
|---|---|
| 0.x | UI direction notes: inspired by Linear, Stripe, GitHub, Vercel, ChatGPT; enterprise-first; dark-first; decisions over dashboards. |
| 1.0 | Design System v1.0 (tokens, components, accessibility, governance) and the Experience & Motion Design Specification v1.0 (deep-space identity, particle AI, motion language). |
| 2.0 | First consolidated Experience & Design Bible. |
| 3.0 | **This document.** Full enterprise rewrite merging the design system, motion specification, AI-identity concept, UI direction, and all experience requirements into one canonical design reference — including exact color values, AI state mappings, and component standards. |

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
9. [Design Language — Layered Dark Theme](#9-design-language--layered-dark-theme)
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

Identity pillars: **dark-first presentation; premium typography; restrained color usage; purposeful motion.** Together they create a professional environment suitable for long working sessions. White space, typography, spacing, and alignment are the primary design tools; color and motion are reserved for meaning (state, focus, feedback).

---

## 6. Design Principles and Goals

**Principles:** simplicity over complexity; consistency across products; accessibility by default; performance-first interfaces; AI-first user experience; responsive layouts; reusable components; clear visual hierarchy; minimal cognitive load; enterprise-grade usability.

**Goals:** unified user experience; scalable component library; consistent branding; faster product development; improved accessibility; cross-platform compatibility (web now; desktop and mobile futures share this language).

---

## 7. The AI Identity — Particle Intelligence

### 7.1 One AI, One Identity

Project Zero exposes **one persistent AI identity across the entire platform**. Users do not meet multiple assistants — they interact with a single evolving **particle-based intelligence**. This replaces the earlier static "dotted face" concept with a *living* particle presence: the face forms from particles when engaged and dissolves back after tasks complete.

The identity must appear **alive but never distracting** — presence without performance.

### 7.2 AI States

The particle identity has seven canonical states, each with a distinct visual signature and mapped color (Section 10.3):

| State | When | Visual Behavior |
|---|---|---|
| **Idle** | No active task | Loose, slow particle drift; minimal glow |
| **Listening** | User is typing/speaking | Particles gather attentively toward the input |
| **Thinking** | Reasoning in progress | Concentrated particle motion; Thinking color |
| **Researching** | Retrieval/knowledge search running | Particles trace outward paths (searching) |
| **Speaking** | Response streaming | Rhythmic pulse synchronized with output |
| **Warning** | Attention needed | Amber signature; sharpened motion |
| **Success** | Task completed | Green resolution; particles settle |

**Future:** collaborative multi-agent visualizations — multiple particle entities coordinating — reserved for the multi-agent roadmap.

### 7.3 Usage Rules

The AI identity appears wherever the platform itself is acting (workspace, long-running operations, login). It never becomes a mascot: no anthropomorphic gimmicks, no idle chatter, no decorative appearances on static screens.

---

## 8. The Mission Control Workspace

The workspace is the center of the product. Instead of isolated pages, it combines **AI conversations, evidence, knowledge exploration, decision briefs, tasks, timelines, connector status, and organizational context into one continuous intelligence environment.**

Requirements:

- **Minimal context switching.** The primary working loop (ask → evidence → decide) never requires leaving the workspace.
- **Users supervise an AI workforce through one unified intelligence interface** — the workspace is where supervision happens: what the AI is doing, what it found, what it recommends, what needs approval.
- **Layered panels, not page navigation**, for evidence, sources, and detail views (progressive disclosure).

---

## 9. Design Language — Layered Dark Theme

The interface is a **layered dark theme with distinct depth per zone** — depth communicates hierarchy:

| Layer | Surface | Color |
|---|---|---|
| Header | Near-black | Deep Space `#050816` |
| Sidebar / navigation | Dark navy | between Deep Space and Workspace |
| Workspace canvas | Blue-black | `#081120` |
| Surfaces (panels) | Elevated | `#101A2E` |
| Cards (highest content layer) | Most elevated | `#16233D` |

Visual identity elements: **deep-space theme, layered depth, soft glass surfaces, floating cards, subtle glow, premium typography, purposeful whitespace.** Neon accents are reserved exclusively for **state changes and focus** — never ambient decoration.

---

## 10. Color System

### 10.1 Background Palette (Canonical Values)

| Token | Hex | Use |
|---|---|---|
| `bg.deep-space` | `#050816` | Header, deepest layer |
| `bg.workspace` | `#081120` | Main canvas |
| `bg.surface` | `#101A2E` | Panels, containers |
| `bg.elevated` | `#16233D` | Cards, elevated content |

### 10.2 Semantic Palette (Canonical Values)

| Token | Hex | Meaning |
|---|---|---|
| `semantic.intelligence` | `#28E7FF` (Cyan) | AI activity, the intelligence accent |
| `semantic.thinking` | `#7B61FF` (Purple) | Reasoning in progress |
| `semantic.knowledge` | `#4FA3FF` (Blue) | Knowledge, sources, retrieval |
| `semantic.success` | `#2EE59D` (Green) | Success, completion, approval |
| `semantic.warning` | `#F7B955` (Amber) | Warnings, attention |
| `semantic.error` | `#FF5D73` (Red) | Errors, failures, rejection |

### 10.3 Accent-to-State Mapping

Primary accents — **Cyan, Purple, Teal, Amber, Green, Red** — communicate **AI state, warnings, success, focus, activity, and confidence**. Teal supplements cyan for secondary activity indication. Colors map to the AI states in Section 7.2 (Thinking→Purple, Researching→Blue/Teal, Success→Green, Warning→Amber, Error→Red, active intelligence→Cyan).

### 10.4 Token Scales

The token system defines full scales for systematic use: **Primary 50–900**, **Neutral (White, Gray 50–900, Black)**, and **Semantic (Success, Warning, Error, Information)**. Scale steps map onto the canonical values above; lighter steps serve text/borders on dark surfaces.

### 10.5 The Color Rule

**Color alone must never communicate critical information.** Icons, labels, and motion reinforce meaning in every state indication (accessibility requirement, Section 25).

---

## 11. Typography

- **Font family:** **Inter**. Fallback stack: System UI, Segoe UI, Roboto, Arial.
- **Type scale:** Display; Heading 1–6; Body Large; Body; Small; Caption.
- **Character:** premium, restrained, highly legible on dark surfaces; generous line height for long sessions; responsive typography scales with breakpoints (Section 24).
- Typography is a primary design tool (Section 5): hierarchy is achieved through scale and weight before color or decoration.

---

## 12. Design Tokens

Every visual property in the product resolves to a token — color (Section 10), typography (Section 11), spacing, radius, elevation (Section 13), motion durations/easings (Section 15). Rules:

1. **Every UI change must use approved design tokens** (governance rule — Section 26).
2. Tokens are the single bridge between design and code: one source, consumed by Tailwind config and component styles.
3. Hard-coded values in components are defects.

---

## 13. Spacing, Grid, Radius, and Elevation

**Spacing.** Base unit **4px**; scale: **4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96**. Use consistent spacing throughout layouts and components — spacing is rhythm, and rhythm is what makes the platform feel composed.

**Grid.** Desktop **12 columns**; tablet **8**; mobile **4**. Container widths: Small, Medium, Large, Full Width.

**Border radius.** None, Small, Medium, Large, Extra Large, Pill, Full — applied consistently by component class (inputs share one radius; cards another).

**Elevation.** Five shadow levels (1–5). Elevation indicates **hierarchy and interactive depth** — on the dark theme, elevation combines subtle shadow with surface-color steps (Section 9). Level jumps signal interactivity (hover lift = one level).

---

## 14. Iconography and Illustration

**Icons.** Style: **outline** primary, **filled** limited (active/selected states). Sizes: **16, 20, 24, 32, 48px**. Rules: consistent stroke width; pixel-aligned; accessible labels on meaningful icons; **decorative icons hidden from screen readers**.

**Illustration.** Restrained and purposeful: illustrations appear in empty states, onboarding, and errors — rendered in the deep-space visual language (particle motifs, line work in semantic colors). No stock-style decorative art.

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

Rules: the sidebar is the persistent spine (dark navy layer); the workspace (AI) is the default landing surface for members; administration surfaces (Organization, Settings) follow the same design language — Mission Control aesthetics apply even to settings; the command palette provides keyboard-first navigation across all sections.

---

## 19. Key Experiences

### 19.1 Login Experience

**Animated intelligence visualization on the left; minimal authentication on the right.** The particle identity is alive on the login screen — the first impression is the living platform. After successful login, **the dashboard assembles** — panels compose into place (fast, purposeful, under the motion rules) rather than popping in.

### 19.2 The AI Workspace Experience

The user-visible reasoning pipeline (a product requirement — *Product Bible* Section 12.3) is expressed experientially:

> **Question → Context → Knowledge Search → Evidence → Reasoning → Confidence → Decision Brief → Final Answer**

Each stage may surface as state (AI identity states, progress motion, evidence panels populating). The user always knows what stage the platform is in and can inspect what it found.

### 19.3 The Decision Experience

Decision Briefs present: recommendation up front; evidence cards with navigable citations; confidence displayed honestly (including *low* confidence); approve/reject controls; audit metadata (model, prompt version) available on inspection — trust through visible mechanics, not claims.

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

Requirements: keyboard navigation everywhere (the entire product operable without a mouse); screen reader support (semantic HTML first, ARIA labels where required); visible focus states (never suppressed — focus is a designed state); high color contrast (validated on dark surfaces — the deep-space palette must meet AA in every text/surface pairing); **reduced-motion support** (every animation has a reduced or static alternative, including the particle identity); scalable typography; consistent interaction behavior; decorative icons hidden from assistive tech; color never the sole carrier of meaning (Section 10.5); accessible charts on dashboards.

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

The layered deep-space surfaces, the particle intelligence, the evidence-forward answers, and the calm purposeful motion together form an identity no competitor screenshot could be mistaken for.

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

*End of Project Zero Experience & Design Bible v3.0 — Master Document 04 of 06.*
