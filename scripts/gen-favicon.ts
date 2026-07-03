/**
 * Generate public/favicon.svg: a single amber polyline tracing the XZ
 * projection of the Lorenz attractor (same constants as the site's
 * masthead/hero animation), decimated to ~600 points and mapped into a
 * 64x64 viewBox.
 *
 * Run: npx tsx scripts/gen-favicon.ts
 *
 * PNG rasterization (apple-touch-icon.png, favicon-32.png) is done
 * separately via macOS `qlmanage`/`sips` — see the shell block below,
 * or the fallback note in the task brief if qlmanage output is unusable.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../public/favicon.svg");

// ---- Lorenz attractor (same constants as LorenzHero.astro's masthead) ----
const SIGMA = 10;
const RHO = 28;
const BETA = 8 / 3;
const dt = 0.004;

let x = 0.1;
let y = 0;
let z = 0;

// Discard warmup transient.
for (let i = 0; i < 800; i++) {
  const dx = SIGMA * (y - x);
  const dy = x * (RHO - z) - y;
  const dz = x * y - BETA * z;
  x += dx * dt;
  y += dy * dt;
  z += dz * dt;
}

const N = 16000;
const xs: number[] = [];
const zs: number[] = [];
for (let i = 0; i < N; i++) {
  const dx = SIGMA * (y - x);
  const dy = x * (RHO - z) - y;
  const dz = x * y - BETA * z;
  x += dx * dt;
  y += dy * dt;
  z += dz * dt;
  xs.push(x);
  zs.push(z);
}

// Decimate to ~600 points.
const TARGET = 600;
const stride = Math.max(1, Math.floor(N / TARGET));
const px: number[] = [];
const pz: number[] = [];
for (let i = 0; i < N; i += stride) {
  px.push(xs[i]);
  pz.push(zs[i]);
}

// Map into a 64x64 viewBox with a small margin.
const SIZE = 64;
const MARGIN = 6;
const minX = Math.min(...px);
const maxX = Math.max(...px);
const minZ = Math.min(...pz);
const maxZ = Math.max(...pz);
const spanX = maxX - minX;
const spanZ = maxZ - minZ;
const scale = (SIZE - 2 * MARGIN) / Math.max(spanX, spanZ);

const points = px
  .map((xv, i) => {
    const zv = pz[i];
    const sx = MARGIN + (xv - minX) * scale + (SIZE - 2 * MARGIN - spanX * scale) / 2;
    const sy =
      SIZE -
      (MARGIN + (zv - minZ) * scale + (SIZE - 2 * MARGIN - spanZ * scale) / 2);
    return `${sx.toFixed(2)},${sy.toFixed(2)}`;
  })
  .join(" ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
  <polyline points="${points}" fill="none" stroke="#996b16" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" />
</svg>
`;

writeFileSync(outPath, svg, "utf-8");
console.log(`Wrote ${outPath} (${px.length} points)`);
