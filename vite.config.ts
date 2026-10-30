import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

/*
 * Tailwind v4 emits modern CSS (color-mix, oklch, @property, nesting).
 * Older browsers drop those rules, so the whole colour scheme disappears.
 * LightningCSS rewrites them into plain CSS the older browsers understand.
 * Version numbers are encoded as (major << 16) | (minor << 8).
 */
const v = (major: number, minor = 0) => (major << 16) | (minor << 8);

const BROWSER_TARGETS = {
  chrome: v(80),
  edge: v(80),
  firefox: v(78),
  safari: v(13),
  ios_saf: v(13),
  samsung: v(12),
  opera: v(67),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: BROWSER_TARGETS,
    },
  },

  build: {
    cssMinify: "lightningcss",
    cssTarget: ["chrome80", "safari13", "firefox78"],
    target: ["chrome80", "safari13", "firefox78", "edge80"],
  },
});
