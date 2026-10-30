/*
 * Windows 7 tops out at Chrome 109 / Edge 109 / Firefox 115 ESR. Those do not
 * understand oklch() or color-mix(), which Tailwind v4 uses for EVERY colour,
 * so the whole colour scheme disappears. These plugins turn them into plain
 * rgb()/rgba() values (with a modern fallback kept by Tailwind itself).
 */
module.exports = {
  plugins: {
    "@csstools/postcss-oklab-function": { preserve: false },
    "@csstools/postcss-color-mix-function": { preserve: false },
  },
};
