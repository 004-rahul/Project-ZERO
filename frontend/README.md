# Project Zero — Frontend

React 19 + Vite + Tailwind v4 + Motion + React Three Fiber + GSAP + Lenis.
Stack decision: [ADR-018](../docs/adr/ADR-018-react-spa-frontend.md).

> **Status: structure only.** The tree, the theme system, and the motion
> tokens exist. No sections are built yet — that is the next step, and it
> waits on a theme decision.

---

## The one rule

**No hex literal, no `cubic-bezier(...)`, and no magic duration in a
component.** Colours come from the theme contract, curves from
`motion/easings.ts`, timings from `motion/durations.ts`. If a value is
missing, add it to the token layer first.

This is what makes "decide the theme later" possible. Break it once and the
decision becomes a rewrite.

---

## Layout

```
src/
├── app/            App shell — providers, router, error boundary
│   └── providers/  ThemeProvider · SmoothScrollProvider · MotionProvider
├── styles/         Tailwind entry, @theme mapping, base layer
├── themes/         Candidate identities — see below
├── motion/         Easings, durations, variants, reusable primitives, hooks
├── three/          r3f scenes, shaders, materials. Lazy-loaded, always
├── components/
│   ├── primitives/ Button, Card, Badge, Input
│   ├── layout/     Container, Section, Grid, Nav, Footer
│   └── decor/      Grain, grid lines, glow — non-interactive visual layers
├── sections/       One folder per landing section, each with its own identity
├── content/        Copy, separated from layout
├── lib/            cn(), env, small helpers
└── assets/         Icons, Lottie
```

**Why `sections/` is folders rather than files.** The brief asks for every
section to have its own visual identity while sharing one design language.
A section that owns its layout, its motion, and its scene in one folder can
be redesigned or deleted without touching its neighbours.

---

## Themes

Three candidates are scaffolded. **None is chosen** — pick one after seeing
them under real content.

| id | Character | Mode |
|---|---|---|
| `obsidian` | Engineered, cold. Near-black, one electric blue. Reads as infrastructure | dark |
| `halation` | Cinematic. Indigo ground, violet bloom, film grain. Most memorable, slightly riskier | dark |
| `blueprint` | Technical daylight. Cool paper, structural blue. Most legible to an enterprise buyer | light |

Switch with `document.documentElement.setAttribute("data-theme", "halation")`,
or via the theme switcher once `ThemeProvider` is wired.

**Adding a candidate:** create `themes/<id>.css` implementing every token in
`themes/contract.ts`, import it in `styles/index.css`, add a row to
`themes/registry.ts`. No component changes — that is the test of whether the
token layer is doing its job.

Deliberately **not** inherited from *Experience & Design Bible* v5.1 (Deep
Teal / Ice Cyan) — this is a fresh direction by instruction. Once a candidate
is chosen, §9–§10 of that document gets updated to match, per its own
governance rule.

---

## Motion

Two files carry the feel of the whole site:

- **`motion/easings.ts`** — `easeOutExpo` `[0.16, 1, 0.3, 1]` is the
  signature: fast out, long settle. Symmetric ease-in-out is what makes
  animation read as default, so it is reserved for things that move both
  ways under one gesture.
- **`motion/durations.ts`** — deliberately at the fast end. If a user waits
  for an animation before they can act, it is too slow no matter how it
  looks.

`GSAP` is present for scroll-driven timelines that Motion's scroll API
handles awkwardly — pinned sections, scrubbed sequences. Reach for Motion
first; GSAP is the exception, not the default.

`Lenis` owns scrolling. Native `scroll-behavior: smooth` is disabled in the
base layer because the two fight.

---

## Performance

The budget is real and enforced in `vite.config.ts`:

- **three.js is never in the entry bundle.** Scenes are lazily imported
  through `three/Canvas.tsx` and mounted only when visible and only on
  devices that can carry them.
- Animate `transform` and `opacity` only. Animating layout properties forces
  a layout pass every frame and is a defect, not a preference.
- `chunkSizeWarningLimit` is 300 KB so entry-bundle creep fails loudly.

## Accessibility

Non-negotiable, and cheap if done from the start:

- Focus is a designed state and is never suppressed.
- Every animation has a reduced-motion path — handled globally in
  `styles/index.css` and by `MotionProvider`, not per component.
- Motion never carries information that is not also available statically.

---

## Running it

```powershell
npm install
npm run dev      # http://localhost:3000
```

Port is pinned to 3000 (Vite defaults to 5173) so the docs, the ports table,
and the API CORS allow-list agree on one number.

To point at a live API, copy `.env.example` to `.env.local`. Only
`VITE_`-prefixed variables reach the client, and everything that does is
public in the bundle — never put a secret there.
