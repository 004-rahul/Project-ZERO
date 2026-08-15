import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  // Pinned to 3000 so every document, the ports table, and the API CORS
  // allow-list agree on one number (Vite's own default is 5173).
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: { port: 3000, strictPort: true },

  build: {
    target: "es2022",
    // Motion and WebGL are the two heavy dependencies. Splitting them keeps
    // three.js out of the initial bundle entirely — it is only fetched when a
    // scene actually mounts (see src/three/Canvas.tsx).
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          motion: ["motion", "gsap", "lenis"],
        },
      },
    },
    // Set just above the three.js chunk, which is large by nature and is
    // never in the critical path (lazy, gated, desktop-only). Anything NEW
    // crossing this line is a real regression worth stopping for — a build
    // that always warns is a build whose warnings get ignored.
    chunkSizeWarningLimit: 1100,
  },
});
