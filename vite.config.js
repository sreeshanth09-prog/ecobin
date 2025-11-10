import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // GitHub Pages base URL
  base: "/ecobin/",

  server: {
    host: true,       // allow external access (required for Render)
    port: 5173        // Vite default port
  },

  preview: {
    host: "0.0.0.0",  // Render requires public host
    port: 10000        // Must match render start command
  },

  build: {
    chunkSizeWarningLimit: 2000,
  }
});
