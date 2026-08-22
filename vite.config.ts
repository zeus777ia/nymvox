import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/llm": {
        target: "https://v1-freedoom.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/llm/, "/v1"),
      },
      "/x-api": {
        target: "https://api.x.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/x-api/, ""),
      },
    },
  },
  preview: {
    port: 3000,
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
