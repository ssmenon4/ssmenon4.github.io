import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// Your GitHub Pages user site. If you later move to a custom domain,
// change this to e.g. "https://your-domain.com".
const SITE = "https://entropy4.github.io";

export default defineConfig({
  site: SITE,
  // User site (Entropy4.github.io) is served at the root, so no `base` needed.
  integrations: [tailwind(), sitemap()],
});
