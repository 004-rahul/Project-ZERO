import type { Config } from "tailwindcss";

/**
 * Project Zero design tokens — the single source of truth in code for the
 * Experience & Design Bible (v5.0 · Deep Teal theme, Ice Cyan accent).
 *
 * The theme is DARK-FIRST and deliberately elevated: the base is #0D1719, not
 * near-black, so surfaces above it can separate by lightness alone without
 * needing heavy borders. Token NAMES are unchanged from the light theme on
 * purpose — `cream` is the page, `card` is a surface, `ink` is primary text —
 * so the whole product re-themes from this file instead of section by section.
 * Their VALUES are what carry the theme.
 *
 * Design governance rule: every UI change must use these tokens; hard-coded
 * values in components are defects.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Elevation ladder. Surfaces separate by lightness, so the design can
           use hairlines for structure rather than to prop up contrast. */
        zone: {
          header: "#0A1315", // chrome, deepest
          sidebar: "#101B1E",
          canvas: "#0D1719",
          footer: "#081113",
        },
        cream: "#0D1719", // page base   (was the light canvas)
        card: "#142225", // surface      +1 step
        raised: "#1C2E32", // hover / nav  +2 steps
        void: "#060E10",

        ink: "#EAF2F2", // primary text (inverted: this is now near-white)
        muted: "#8FA3A6",
        faint: "#6B8085",
        "on-dark": "#EAF2F2",
        "on-dark-muted": "#8FA3A6",

        /* Two hairline weights, split by WCAG 1.4.11. `line` is decorative
           (dividers, the page grid, section rules) and is exempt from the 3:1
           non-text minimum. `line-strong` bounds INTERACTIVE controls — cards,
           inputs, secondary buttons — and clears 3:1 against both the page base
           and card surface. Using one weight for both would either fail the
           audit or make every divider look like wireframe. */
        line: "#314E53",
        "line-strong": "#4F7A82",

        accent: {
          DEFAULT: "#3DDBD9", // ice cyan
          strong: "#2BB8B6",
          bright: "#7CEDEB",
        },
        /* Secondary hue, used sparingly: never as a second CTA colour, only to
           separate one data channel from another. */
        second: {
          DEFAULT: "#7C9EFF",
          soft: "#A9BEFF",
        },
        thinking: "#7C9EFF",
        knowledge: {
          DEFAULT: "#3DDBD9",
          dark: "#7CEDEB",
        },
        success: "#34D399",
        warning: "#FBBF24",
        danger: "#F87171",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        // Design Bible v3.1 §11 — industry-standard scale
        "2xs": ["11px", { lineHeight: "16px" }],
        xs: ["12px", { lineHeight: "18px" }],
        sm: ["13px", { lineHeight: "20px" }],
        base: ["14px", { lineHeight: "22px" }],
        md: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "27px" }],
        xl: ["22px", { lineHeight: "30px" }],
        "2xl": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "3xl": ["36px", { lineHeight: "42px", letterSpacing: "-0.025em" }],
        "4xl": ["52px", { lineHeight: "56px", letterSpacing: "-0.03em" }],
        hero: ["clamp(36px,6.2vw,88px)", { lineHeight: "1.05", letterSpacing: "-0.04em" }],
      },
      spacing: {
        // 4px base grid (Design Bible §13)
        "4.5": "18px",
      },
      borderRadius: {
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
      },
      /* On a dark canvas a drop shadow is invisible — depth has to come from a
         top inset highlight (the edge catching light) plus a deeper cast
         below. Without the inset, dark cards read as flat holes. */
      boxShadow: {
        card: "inset 0 1px 0 rgba(255,255,255,.045), 0 2px 8px rgba(0,0,0,.35)",
        lift: "inset 0 1px 0 rgba(255,255,255,.07), 0 10px 34px rgba(0,0,0,.5)",
        "accent-glow": "0 6px 26px rgba(61,219,217,.28)",
        ring: "0 0 0 1px rgba(61,219,217,.35)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: ".55" },
          "50%": { opacity: ".9" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "word-in": {
          from: { opacity: "0", filter: "blur(14px)", transform: "translateY(28px)" },
          to: { opacity: "1", filter: "blur(0)", transform: "translateY(0)" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
        drip: {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "55%": { transform: "scaleY(1)", transformOrigin: "top" },
          "56%": { transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
        sheen: {
          from: { transform: "translateX(-160%) skewX(-18deg)" },
          to: { transform: "translateX(260%) skewX(-18deg)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "drift-1": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(150px,90px) scale(1.14)" },
        },
        "drift-2": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-130px,-70px) scale(.88)" },
        },
        "drift-3": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-100px,-120px) scale(1.1)" },
        },
      },
      animation: {
        "fade-up": "fade-up .8s ease both",
        "glow-pulse": "glow-pulse 6s ease-in-out infinite",
        floaty: "floaty 9s ease-in-out infinite",
        "word-in": "word-in 1s cubic-bezier(.2,.7,.2,1) both",
        marquee: "marquee 26s linear infinite",
        drip: "drip 1.9s ease-in-out infinite",
        sheen: "sheen .9s ease",
        "gradient-x": "gradient-x 7s ease-in-out infinite",
        "drift-1": "drift-1 16s ease-in-out infinite",
        "drift-2": "drift-2 20s ease-in-out infinite",
        "drift-3": "drift-3 24s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
