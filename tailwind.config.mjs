/** @type {import('tailwindcss').Config} */
// Design tokens live in src/styles/global.css as CSS custom properties.
// Tailwind is kept for layout utilities only.
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  corePlugins: { preflight: true },
  theme: { extend: {} },
  plugins: [],
};
