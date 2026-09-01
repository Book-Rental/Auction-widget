import react from '@vitejs/plugin-react'
import path from "path";
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.widget.tsx"),
      name: "CaasWidget",
      formats: ["iife"],
      fileName: () => "auction_widget.js",
    },
    rollupOptions: {
      external: [],
    },
    minify: true,
  },
  define: {
    // Replace process.env with empty object
    "process.env": {},
  },
});