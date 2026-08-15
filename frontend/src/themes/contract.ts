/**
 * The theme contract.
 *
 * Every theme in `src/themes/*.css` must define exactly these custom
 * properties — no more, no less. Components consume them through Tailwind
 * utilities that map to these variables, so switching themes is a single
 * attribute change on <html> and never a component edit.
 *
 * Token names describe ROLE, never colour. `--surface-raised` stays
 * `--surface-raised` whether the theme is black, white, or violet. This is
 * the rule that makes "decide the theme later" possible without a rewrite.
 */

export const THEME_TOKENS = [
  /* ── Ground and surfaces — the elevation ladder ────────────────── */
  "--bg",              // page ground
  "--surface",         // cards, panels
  "--surface-raised",  // hover, popovers, one step up
  "--surface-sunken",  // wells, insets, one step down
  "--overlay",         // scrims behind modals

  /* ── Text ──────────────────────────────────────────────────────── */
  "--text",            // primary
  "--text-muted",      // secondary
  "--text-faint",      // tertiary, metadata, disabled
  "--text-on-accent",  // text sitting on an accent fill

  /* ── Accent ────────────────────────────────────────────────────── */
  "--accent",          // primary actions, focus, active state
  "--accent-hover",
  "--accent-subtle",   // tinted backgrounds, low-emphasis fills
  "--accent-contrast", // accent used as TEXT — must pass contrast on --bg

  /* ── Secondary hue. Never a second call-to-action colour; used only
        to separate one data channel from another. ─────────────────── */
  "--second",
  "--second-subtle",

  /* ── Lines. Split by WCAG 1.4.11: `subtle` is decorative and exempt
        from the 3:1 non-text minimum; `strong` bounds interactive
        controls and is not. ───────────────────────────────────────── */
  "--line-subtle",
  "--line-strong",

  /* Specular top edge. A dark panel needs a lit edge to sit above the
     page; a light one needs none, so light themes set this transparent. */
  "--edge",

  /* ── Semantic. Separate from accent by rule — a status colour is not
        a brand colour. ───────────────────────────────────────────── */
  "--success",
  "--warning",
  "--danger",
  "--info",

  /* ── Effects. Themes differ most here: a dark theme needs an inset
        highlight to read as raised, a light theme needs a cast shadow. */
  "--shadow-sm",
  "--shadow-md",
  "--shadow-lg",
  "--glow",            // accent bloom, used sparingly
  "--grain-opacity",   // film grain strength, 0 to disable per theme

  /* ── Scene. Consumed by React Three Fiber so 3D matches the theme
        instead of floating on top of it. ─────────────────────────── */
  "--scene-fog",
  "--scene-key",       // key light / primary particle colour
  "--scene-rim",       // rim light / secondary particle colour
] as const;

export type ThemeToken = (typeof THEME_TOKENS)[number];

export interface ThemeMeta {
  /** Stable id — the value written to <html data-theme="…">. */
  id: string;
  /** Display name for the theme switcher. */
  name: string;
  /** One line on the intent, so a choice can be made on character. */
  character: string;
  /** Drives `color-scheme` and any luminance-dependent logic. */
  mode: "dark" | "light";
}
