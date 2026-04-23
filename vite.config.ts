import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "react-dom/test-utils",
        replacement: "preact/test-utils"
      },
      {
        find: "react-dom/client",
        replacement: "preact/compat/client"
      },
      {
        find: "react-dom",
        replacement: "preact/compat"
      },
      {
        find: "react/jsx-dev-runtime",
        replacement: "preact/jsx-dev-runtime"
      },
      {
        find: "react/jsx-runtime",
        replacement: "preact/jsx-runtime"
      },
      {
        find: "react",
        replacement: "preact/compat"
      }
    ]
  },
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
