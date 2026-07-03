#!/usr/bin/env node
// Export each RAG post's abstract hero cover (SVG -> 1200x675 PNG) for the
// `image:` field, which drives the article hero, index thumbnail, and OG image
// (social scrapers don't render SVG). Inline explanatory diagrams stay SVG and
// are not rasterized. Run after editing any hero-*.svg:
//   node scripts/rasterize-figures.mjs
import sharp from "sharp";
import { readFileSync } from "fs";

const heroes = [
  "hero-revisited",
  "hero-atomicity",
  "hero-coverage",
  "hero-domaincollapse",
  "hero-routing",
  "hero-evalgap",
];

for (const name of heroes) {
  const svg = readFileSync(new URL(`../public/blog/${name}.svg`, import.meta.url));
  await sharp(svg, { density: 200 })
    .resize(1200, 675)
    .png()
    .toFile(new URL(`../public/blog/${name}.png`, import.meta.url).pathname);
  console.log("wrote", `${name}.png`);
}
