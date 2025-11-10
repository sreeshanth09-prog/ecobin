import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ecobin/",

  build: {
    chunkSizeWarningLimit: 2000, // increase warning limit (in KB)
  }
});