import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      external: [],
      input: "index.html",
    },
  },
  define: {
    global: 'globalThis',
  },
});
