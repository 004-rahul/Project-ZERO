import type { ThemeMeta } from "./contract";

/**
 * Theme registry.
 *
 * Candidates for the landing page's visual identity. None is chosen yet —
 * the point of this structure is that the decision can be deferred without
 * blocking build work, and reversed without a rewrite.
 *
 * Adding a candidate: create `src/themes/<id>.css` implementing every token
 * in `contract.ts`, import it in `src/styles/index.css`, add a row here.
 */
export const THEMES: ThemeMeta[] = [
  {
    id: "obsidian",
    name: "Obsidian",
    character:
      "Engineered and cold. Near-black ground, one electric blue doing all the work. Reads as infrastructure.",
    mode: "dark",
  },
  {
    id: "halation",
    name: "Halation",
    character:
      "Cinematic and atmospheric. Indigo ground with violet bloom and film grain. Most memorable, slightly riskier.",
    mode: "dark",
  },
  {
    id: "blueprint",
    name: "Blueprint",
    character:
      "Clean and technical daylight. Cool paper, structural blue. Most legible to an enterprise buyer.",
    mode: "light",
  },
];

export const DEFAULT_THEME = "obsidian";

export const THEME_STORAGE_KEY = "pz-theme";

export function isValidTheme(id: string | null): id is string {
  return !!id && THEMES.some((t) => t.id === id);
}

export function getTheme(id: string): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
