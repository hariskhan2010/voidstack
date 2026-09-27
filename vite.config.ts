import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative asset paths: the site is served from a subfolder (GitHub Pages /voidstack/).
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // `motion/react` is framer-motion under a new name. Lightswind pins framer-motion 12 while
      // `motion` ships 13, which bundled two copies of the engine (+150 kB). Point both at one.
      "motion/react": "framer-motion",
    },
  },
});
