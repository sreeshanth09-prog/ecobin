import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  base: "/ecobin/",   // keep for GitHub Pages

  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "ecobin-8q2h.onrender.com",   // your Render domain
    ],
  },

  preview: {
    host: "0.0.0.0",
    port: 10000,
  },

  build: {
    chunkSizeWarningLimit: 2000,
  },
});
