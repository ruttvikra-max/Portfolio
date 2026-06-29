import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite + React, Vercel-ready (static SPA).
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
