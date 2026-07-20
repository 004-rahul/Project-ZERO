import type { Config } from "tailwindcss";

/**
 * Project Zero design tokens — the single source of truth in code for the
 * Experience & Design Bible v3.1 (Zoned Graphite theme, Violet accent).
 * Design governance rule: every UI change must use these tokens; hard-coded
 * values in components are defects.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        zone: {
          header: "#101114",
          sidebar: "#17181C",
          canvas: "#FAFAFB",
          footer: "#0B0C0E",
        },
        card: "#FFFFFF",
        ink: "#17181C",
        muted: "#5F6168",
        faint: "#989AA2",
        "on-dark": "#F4F4F5",
        "on-dark-muted": "#9EA0A8",
        line: "#E8E8EA",
        "line-strong": "#DCDCDF",
        accent: {
          DEFAULT: "#7C3AED",
          strong: "#6D28D9",
          bright: "#A78BFA",
        },
        thinking: "#8B5CF6",
        knowledge: {
          DEFAULT: "#0E7490",
          dark: "#22A3BF",
        },
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
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
      boxShadow: {
        card: "0 1px 2px rgba(20,20,25,.05), 0 4px 16px rgba(20,20,25,.05)",
        lift: "0 2px 6px rgba(20,20,25,.07), 0 16px 44px rgba(20,20,25,.10)",
        "accent-glow": "0 4px 20px rgba(124,58,237,.35)",
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
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "fade-up": "fade-up .8s ease both",
        "glow-pulse": "glow-pulse 6s ease-in-out infinite",
        floaty: "floaty 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
