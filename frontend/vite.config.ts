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
    // Motion is the one heavy always-on dependency, so it gets its own chunk
    // and its own cache lifetime.
    //
    // three.js is deliberately NOT listed here. Naming a package in
    // manualChunks forces Rollup to resolve and emit it even when nothing
    // imports it — which is exactly what was happening: a 193 kB chunk for a
    // library the page no longer used. When 3D returns it should arrive via a
    // dynamic import(), which code-splits it automatically and only for the
    // route that needs it.
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["motion", "lenis"],
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
