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
        cream: "#FAF7F0",
        void: "#080709",
        aurora: {
          violet: "#C084FC",
          magenta: "#E45FBC",
          amber: "#F2A65A",
          bright: "#D9A1F5",
          strong: "#C55FD6",
          pink: "#E4599C",
        },
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
