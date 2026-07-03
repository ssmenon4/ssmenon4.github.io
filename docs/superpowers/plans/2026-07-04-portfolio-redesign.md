# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Stitch/M3 template design with the "typeset technical journal" design locked in `docs/superpowers/specs/2026-07-04-portfolio-redesign-design.md`.

**Architecture:** Astro 4 static site keeps its data-file/content-collection architecture untouched; the redesign replaces the presentation layer — a new CSS token system (two grounds, `data-theme` override), three self-hosted font roles, rewritten layout/chrome components, and rewritten page templates that port their markup from the approved mock at `docs/superpowers/specs/2026-07-04-portfolio-redesign-mock.html` (open it in a browser; it IS the target — every class referenced below exists in its `<style>` block).

**Tech Stack:** Astro ^4.16, Tailwind 3 (kept for utility classes only; design tokens live in plain CSS custom properties), @fontsource packages for self-hosted fonts, vanilla canvas.

## Global Constraints

- Token palette, roles, and hex values exactly as spec §4 — light `--bg:#faf8f3` … dark `--bg:#0b0e15` …; `--meta` is `#7a7365` light / `#74839c` dark (contrast-audited; do not change).
- Amber `--signal` only for: live things, interactive things, system numerals. No new roles.
- No `border-radius`, no `box-shadow`, no gradients, no icon font, anywhere in the new UI.
- Video playback is NEVER filtered/duotoned; only poster stills may be.
- No font CDNs (Google Fonts links must be gone); fonts self-hosted via @fontsource.
- Routes keep their existing paths (`/projects`, `/blog`, `/publications`, `/resume`); nav labels become WORK / WRITING / PAPERS / RESUME / ABOUT; `/about` is a new route. (Resolves the spec §10 deferred decision: no renames, no redirects needed.)
- Existing data files (`site.ts`, `projects.ts`, `resume.ts`, `publications.ts`) and blog frontmatter schema are not modified except where a task explicitly says so.
- Verification per task: `npm run build` must exit 0, plus the task's listed visual checks in `npm run dev` (check BOTH themes via the toggle).
- Commit after every task with the message given in the task.

## File Structure

```
src/styles/global.css            REWRITE  — tokens, base typography, house classes
tailwind.config.mjs              REWRITE  — slim: content globs + spacing only
src/layouts/BaseLayout.astro     REWRITE  — head (fonts, theme script → data-theme), body chrome
src/components/Nav.astro         REWRITE  — top bar: name + mono nav + theme toggle
src/components/Footer.astro      REWRITE  — mono colophon footer
src/components/ThemeToggle.astro REWRITE  — ◐ toggle, data-theme + localStorage
src/components/LorenzHero.astro  MODIFY   — palette→tokens, frame removal, why? footnote
src/components/Plate.astro       CREATE   — framed figure + mono caption
src/components/StatusStrip.astro CREATE   — homepage status strip
src/components/AmphoreusMark.astro CREATE — lemniscate canvas mark
src/components/PageMast.astro    CREATE   — inner-page crumb/title/sub/kv header
src/data/now.ts                  CREATE   — hand-maintained status strip content
src/lib/build-info.ts            CREATE   — last-commit-at-build helper
src/lib/reading-time.ts          CREATE   — word-count → minutes
src/pages/index.astro            REWRITE  — masthead → index homepage
src/pages/projects.astro         REWRITE  — ledger + dossiers
src/pages/blog/index.astro       REWRITE  — writing index w/ phrase decks
src/pages/blog/[...slug].astro   REWRITE  — article header system + prose
src/pages/publications.astro     REWRITE  — reference list + BibTeX cite
src/pages/resume.astro           REWRITE  — typeset CV
src/pages/about.astro            CREATE   — About letter + NOW + colophon
src/components/VideoEmbed.astro  MODIFY   — plate frame + duotoned poster, untouched playback
public/blog/*.svg (8 files)      REWRITE  — restyle diagrams to house language
public/favicon.svg + PNGs        REPLACE  — Lorenz mark favicon
DELETE: src/components/Icon.astro, src/components/SeriesBadge.astro (folded into pages),
        public/projects/Amphoreus.jpeg (replaced by AmphoreusMark)
```

There is no JS test framework in this repo and the deliverable is static markup; the test cycle for every task is `npm run build` (must pass) + the named visual assertions. Where a task adds a pure function (`reading-time.ts`), it gets a real assertion step via `node`.

---

### Task 1: Token foundation — global.css, tailwind.config, BaseLayout head

**Files:**
- Modify: `src/styles/global.css` (full rewrite)
- Modify: `tailwind.config.mjs` (full rewrite)
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `package.json` (add @fontsource deps)

**Interfaces:**
- Produces: CSS custom properties `--bg --ink --sub --meta --line --line-strong --signal --signal-bright --trail --sel`; classes `.mono`, `.page`; font stacks `--font-serif`, `--font-sans`, `--font-mono`; `data-theme` attribute contract on `<html>`. All later tasks consume these.

- [ ] **Step 1: Install fonts**

```bash
npm install @fontsource/newsreader @fontsource-variable/jetbrains-mono
```

- [ ] **Step 2: Rewrite `src/styles/global.css`**

Replace the entire file with (port the token block verbatim from the mock's `<style>`, lines 1–30; then base rules):

```css
@import "@fontsource/newsreader/400.css";
@import "@fontsource/newsreader/400-italic.css";
@import "@fontsource-variable/jetbrains-mono";

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============ identity tokens: one design, two grounds ============ */
:root{
  --bg:#faf8f3; --ink:#211f1b; --sub:#5f594e; --meta:#7a7365;
  --line:#e5e0d5; --line-strong:#c9c2b2;
  --signal:#996b16; --signal-bright:#b07d1a; --trail:#8a5a10; --sel:#f0ead9;
  --font-serif:"Newsreader",Georgia,"Iowan Old Style",serif;
  --font-sans:"Helvetica Neue",Helvetica,Arial,sans-serif;
  --font-mono:"JetBrains Mono Variable",ui-monospace,"SF Mono",Menlo,monospace;
}
@media (prefers-color-scheme: dark){
  :root{ --bg:#0b0e15; --ink:#e8ecf2; --sub:#9aa5b5; --meta:#74839c;
    --line:#1c2230; --line-strong:#323c50;
    --signal:#e0a83c; --signal-bright:#f2c05e; --trail:#d69a2e; --sel:#1a2130; }
}
:root[data-theme="dark"]{ --bg:#0b0e15; --ink:#e8ecf2; --sub:#9aa5b5; --meta:#74839c;
  --line:#1c2230; --line-strong:#323c50;
  --signal:#e0a83c; --signal-bright:#f2c05e; --trail:#d69a2e; --sel:#1a2130; }
:root[data-theme="light"]{ --bg:#faf8f3; --ink:#211f1b; --sub:#5f594e; --meta:#7a7365;
  --line:#e5e0d5; --line-strong:#c9c2b2;
  --signal:#996b16; --signal-bright:#b07d1a; --trail:#8a5a10; --sel:#f0ead9; }

html,body{ overflow-x:clip; }
body{ margin:0; background:var(--bg); color:var(--ink);
  font-family:var(--font-serif); line-height:1.6; -webkit-font-smoothing:antialiased; }
::selection{ background:var(--sel); }
a{ color:inherit; text-decoration:none; }
.mono{ font-family:var(--font-mono); }
.page{ max-width:880px; margin:0 auto; padding:0 32px; }
h1,h2,h3,h4{ font-weight:400; text-wrap:balance; }
```

Then append, unchanged except `font-family` swapped to the `--font-*` variables, the mock's shared component classes (mock `<style>` sections: top bar, masthead, status, sections `.sh`, entries `.entry/.spec/.links`, plates `.plate/.plate-cap`, writing `.series-head/.post/.wpost/.offcuts`, papers `.paper`, about `.about/.now`, footer, pagemast, ledger, cv/skillrow, and both `@media` blocks). Delete every trace of the old file (M3 vars, `.grain-overlay`, `.noise-bg`, pebble/morph keyframes, `.link-highlight` — re-add `.link-highlight{color:var(--signal)}` since blog content uses it).

- [ ] **Step 3: Rewrite `tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
// Design tokens live in src/styles/global.css as CSS custom properties.
// Tailwind is kept for layout utilities only.
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  corePlugins: { preflight: true },
  theme: { extend: {} },
  plugins: [],
};
```

- [ ] **Step 4: Update `src/layouts/BaseLayout.astro`**

- Remove both Google Fonts `<link>` blocks and the Material Symbols link (lines 52–62).
- Replace the theme script with the `data-theme` contract:

```html
<script is:inline>
  (() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light")
        document.documentElement.setAttribute("data-theme", stored);
    } catch {}
  })();
</script>
```

- Replace the `<html class="light">` with `<html lang="en">`.
- Replace the `<body>` classes with `class="min-h-screen flex flex-col"` and delete `<div class="grain-overlay"></div>` and the `noiseBg` prop.

- [ ] **Step 5: Build**

Run: `npm run build` — Expected: exit 0. `npm run dev`: site renders (ugly mid-migration is fine) with paper background `#faf8f3`, serif body, no grain, no console 404s for fonts.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "redesign: token foundation — new CSS custom-property system, self-hosted fonts, data-theme contract"
```

---

### Task 2: Chrome — Nav, ThemeToggle, Footer

**Files:**
- Modify: `src/components/Nav.astro` (full rewrite)
- Modify: `src/components/ThemeToggle.astro` (full rewrite)
- Modify: `src/components/Footer.astro` (full rewrite)
- Modify: `src/config/site.ts` (nav labels)

**Interfaces:**
- Consumes: tokens + `.page`/`.mono` from Task 1.
- Produces: `<Nav />`, `<Footer />` used by BaseLayout (already wired); nav array `{label, href}` with labels WORK/WRITING/PAPERS/RESUME/ABOUT.

- [ ] **Step 1: Update nav data in `src/config/site.ts`**

```ts
export const nav = [
  { label: "WORK", href: "/projects" },
  { label: "WRITING", href: "/blog" },
  { label: "PAPERS", href: "/publications" },
  { label: "RESUME", href: "/resume" },
  { label: "ABOUT", href: "/about" },
];
```

- [ ] **Step 2: Rewrite `Nav.astro`** — port mock's `.top` block:

```astro
---
import { site, nav } from "../config/site";
import ThemeToggle from "./ThemeToggle.astro";
---
<header class="page">
  <div class="top">
    <a class="name" href="/">{site.brand.replace(" ", " ")}</a>
    <nav>
      {nav.map((n) => <a href={n.href}>{n.label}</a>)}
      <ThemeToggle />
    </nav>
  </div>
</header>
```

(`.top`, `.top .name`, `.top nav` classes were added to global.css in Task 1.)

- [ ] **Step 3: Rewrite `ThemeToggle.astro`**

```astro
<button id="theme-toggle" aria-label="Toggle color theme" class="mono">◐</button>
<style>
  #theme-toggle{ background:none; border:none; cursor:pointer; color:var(--meta);
    font-size:13px; padding:0; }
  #theme-toggle:hover{ color:var(--signal); }
</style>
<script is:inline>
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const r = document.documentElement;
    const dark = r.getAttribute("data-theme") === "dark" ||
      (!r.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    const next = dark ? "light" : "dark";
    r.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
  });
</script>
```

- [ ] **Step 4: Rewrite `Footer.astro`** — port mock's `<footer>` (socials from `site.ts`):

```astro
---
import { site, socials } from "../config/site";
---
<footer class="page-footer">
  <span>© {new Date().getFullYear()} {site.author.toUpperCase()} · BUILT WITH CURIOSITY</span>
  <span>
    {socials.map((s, i) => <>{i > 0 && " · "}<a href={s.href}>{s.label.toUpperCase()}</a></>)}
  </span>
  <span>SET IN NEWSREADER &amp; JETBRAINS MONO · RENDERED BY ASTRO · σ=10 ρ=28 β=8/3</span>
</footer>
```

Rename the mock's `footer{}` CSS rule to `.page-footer` in global.css (element selector would hit nothing else, but the class keeps it explicit), and wrap it in `.page` margins: add `max-width:880px; margin-left:auto; margin-right:auto; padding-left:32px; padding-right:32px;` to the rule.

- [ ] **Step 5: Build + verify**

`npm run build` exit 0. Dev: top bar shows name left, five mono labels + ◐ right; toggle flips ground instantly and survives reload; footer is three mono spans.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "redesign: chrome — mono nav, ◐ theme toggle, colophon footer"
```

---

### Task 3: Shared primitives — Plate, PageMast, reading-time, now.ts, build-info

**Files:**
- Create: `src/components/Plate.astro`
- Create: `src/components/PageMast.astro`
- Create: `src/lib/reading-time.ts`
- Create: `src/data/now.ts`
- Create: `src/lib/build-info.ts`

**Interfaces:**
- Produces:
  - `Plate.astro` props: `{ caption: string; full?: boolean }`, default slot for media.
  - `PageMast.astro` props: `{ crumb: string; title: string; sub?: string; kv?: string }` plus named slot `kv` for rich kv content.
  - `readingTime(body: string): number` — minutes, ceil(words/200), min 1.
  - `now.ts` exports `nowStatus: { building: string; reading?: string; openTo: string }`.
  - `buildInfo(): { lastCommitISO: string; lastCommitRelative: string }`.

- [ ] **Step 1: Write `src/lib/reading-time.ts` with its assertion**

```ts
/** Estimated reading time in whole minutes at ~200 wpm. */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
```

- [ ] **Step 2: Verify the function**

Run:
```bash
node --input-type=module -e "
import { readingTime } from './src/lib/reading-time.ts';
" 2>/dev/null || npx tsx -e "
import { readingTime } from './src/lib/reading-time.ts';
console.assert(readingTime('word '.repeat(1195)) === 6, '1195 words -> 6');
console.assert(readingTime('hi') === 1, 'floor is 1');
console.log('reading-time OK');
"
```
Expected: `reading-time OK`. (If `tsx` is unavailable, `npm i -D tsx` first.)

- [ ] **Step 3: Write `src/data/now.ts`**

```ts
/** Hand-maintained "now" content for the homepage status strip + about page.
 *  If a line goes stale, delete it — a stale NOW is worse than none. */
export const nowStatus = {
  openTo: "OPEN TO INTERESTING PROBLEMS",
  building: "AMPHOREUS",
  reading: "", // e.g. "“CHAOS” — GLEICK"; empty string hides the cell
};
```

- [ ] **Step 4: Write `src/lib/build-info.ts`**

```ts
import { execSync } from "node:child_process";

/** Last commit time, captured at build. Site rebuilds on push, so honest by construction. */
export function buildInfo() {
  const iso = execSync("git log -1 --format=%cI").toString().trim();
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  const rel = days === 0 ? "TODAY" : days === 1 ? "YESTERDAY" : `${days} DAYS AGO`;
  return { lastCommitISO: iso, lastCommitRelative: rel };
}
```

- [ ] **Step 5: Write `Plate.astro`**

```astro
---
interface Props { caption: string; full?: boolean }
const { caption } = Astro.props;
---
<figure class="plate-fig">
  <div class="plate"><slot /></div>
  <figcaption class="plate-cap" set:html={caption} />
</figure>
<style>
  .plate-fig{ margin:0; }
</style>
```

(`.plate` and `.plate-cap` come from global.css.)

- [ ] **Step 6: Write `PageMast.astro`**

```astro
---
interface Props { crumb: string; title: string; sub?: string; kv?: string }
const { crumb, title, sub, kv } = Astro.props;
---
<div class="pagemast">
  <div class="crumb mono">SHIVASHANKAR MENON / <b>{crumb}</b></div>
  <h1>{title}</h1>
  {sub && <p class="sub">{sub}</p>}
  {(kv || Astro.slots.has("kv")) && <div class="kv mono">{kv}<slot name="kv" /></div>}
</div>
```

Adjust global.css `.pagemast h3` selector to `.pagemast h1` (inner pages' H1 is the page title).

- [ ] **Step 7: Build + commit**

`npm run build` exit 0.
```bash
git add -A && git commit -m "redesign: shared primitives — Plate, PageMast, reading-time, now.ts, build-info"
```

---

### Task 4: LorenzHero re-dress

**Files:**
- Modify: `src/components/LorenzHero.astro`

**Interfaces:**
- Consumes: tokens (`--trail`, `--signal-bright`, `--meta`, `--line-strong`).
- Produces: same component tag `<LorenzHero />`; all interaction mechanics unchanged (turntable, drag + 3s ease-back, comets, breathing, lattice, reduced-motion).

- [ ] **Step 1: Re-point palettes at tokens**

Replace `PALETTE_LIGHT`/`PALETTE_DARK`/`DOT_LIGHT`/`DOT_DARK` constants with a runtime token read (keep the Stop tuple type; sample the trail family):

```ts
function cssRGB(name: string): Stop {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseInt(v.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
// gradient: --trail → --signal → --signal-bright ; lattice dots: --line-strong
```

Rebuild the gradient stops array from those three tokens wherever the old palettes were consumed; use `--line-strong` for lattice dots. Re-read tokens inside the existing theme MutationObserver — and change that observer to watch `attributes: true, attributeFilter: ["data-theme"]` on `<html>` instead of the `.dark` class.

- [ ] **Step 2: Replace the `?` popover with the caption footnote**

Delete the `.lorenz-help-wrap` block (button, tooltip, popover) and its `<style>`. The caption + footnote live in the homepage masthead (Task 5), not in this component — LorenzHero becomes canvas-only.

- [ ] **Step 3: Verify**

`npm run build` exit 0. Dev (temporarily drop `<LorenzHero />` into index if not yet reachable): attractor draws in amber trail family on both grounds; drag works; theme flip recolors; no `?` button.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "redesign: LorenzHero re-dress — token palettes, data-theme observer, popover removed"
```

---

### Task 5: Homepage

**Files:**
- Modify: `src/pages/index.astro` (full rewrite)
- Create: `src/components/StatusStrip.astro`

**Interfaces:**
- Consumes: `LorenzHero`, `StatusStrip`, `Plate`, `AmphoreusMark` (Task 6 — until then use a `Plate` with a `[fig. 2 — placeholder]` div), data files, `readingTime`, `nowStatus`, `buildInfo`.
- Produces: the live homepage matching mock lines 149–268 (top bar through § 04 + footer).

- [ ] **Step 1: Write `StatusStrip.astro`**

```astro
---
import { nowStatus } from "../data/now";
import { buildInfo } from "../lib/build-info";
const { lastCommitRelative } = buildInfo();
---
<div class="status mono">
  <div><span class="led">●</span> {nowStatus.openTo}</div>
  <div>LAST COMMIT <b>{lastCommitRelative}</b></div>
  <div>CURRENTLY BUILDING <b>{nowStatus.building}</b></div>
  {nowStatus.reading && <div>READING <b>{nowStatus.reading}</b></div>}
</div>
```

- [ ] **Step 2: Rewrite `src/pages/index.astro`**

Port the mock's homepage markup one section at a time, replacing hardcoded copy with data-driven loops:

- Masthead: `<h1>Engineering AI, from research to production.</h1>`, intro `<p>` from `site.description` first two sentences, `<LorenzHero />` positioned by the mock's `.mast canvas` rule (apply the positioning to a wrapper div `.mast-fig`), caption line with `● live · why?` and the hidden `#whynote` footnote (port the mock's `#why`/`#whynote` markup + inline toggle script verbatim; footnote text is the childhood chaos-theory sentence + Reddit link from the old LorenzHero popover).
- `<StatusStrip />`.
- § 01 Selected Work: loop `projects.filter(p => p.featured)`; Amphoreus entry includes the `.spec` block from `highlights` and links `WATCH THE DEMO ▸` → `/projects#amphoreus-dnd`, `READ THE WRITE-UP` → `blogHref`; side plates: Amphoreus → placeholder (Task 6 swaps in `<AmphoreusMark />`), wheelchair → `<Plate caption="fig. 3 — vibration trace, cobblestone"><img src="/projects/AdaGen.jpg" …/></Plate>`, GALEX → `<Plate caption="fig. 4 — GALEX deep-sky field"><img src="/projects/Galex.jpg" …/></Plate>`. Real images replace the mock's canvas stand-ins; give plate images `style="filter:grayscale(1) contrast(1.08) brightness(1.02)"` and the amber blend overlay div (mock Appendix B duotone technique) — index context = duotone per spec §7.
- § 02 Writing: `getCollection("blog")`, series posts sorted by `order`, rows `№ {order} / title / date`; LATEST block = newest non-series post.
- § 03 Publications: loop all of `publications.ts`, one-liners `title / venue, year / DOI link`.
- § 04 About: the two v12 paragraphs (copy verbatim from mock) + NOW list from `nowStatus`.

- [ ] **Step 3: Verify**

`npm run build` exit 0. Dev, both themes: masthead attractor draws behind/right of headline and headline stays legible at 900–1100px viewport; `why?` toggles the footnote; status strip wraps at narrow widths with no horizontal scrollbar; §01–§04 all data-driven (edit a title in `projects.ts`, see it change).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "redesign: homepage — masthead→index with live attractor, status strip, data-driven sections"
```

---

### Task 6: AmphoreusMark + favicon

**Files:**
- Create: `src/components/AmphoreusMark.astro`
- Modify: `src/pages/index.astro` (swap placeholder), `src/data/projects.ts` (remove `image` from Amphoreus entry)
- Replace: `public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png`
- Delete: `public/projects/Amphoreus.jpeg`

**Interfaces:**
- Consumes: tokens.
- Produces: `<AmphoreusMark height={120} />` — canvas lemniscate; props `{ height?: number }`.

- [ ] **Step 1: Write `AmphoreusMark.astro`**

Canvas component; port the mock's `.fig-net` renderer verbatim (mock `<script>`, the `fig-net` forEach block): dense 14-pass lemniscate band (`pt(t,sc)` with `sin/cos/(1+sin²)`), ORCH amber node at the crossing with label below, DM node at left apex label above, player trio at `[-.22, 0, .22]` (middle scale 1, outers .93) with `PLAYERS ×13` label offset from `pt(.22,1)` — plus the same `data-theme` MutationObserver redraw used in LorenzHero.

- [ ] **Step 2: Wire into homepage + projects data**

Homepage § 01 Amphoreus plate: `<Plate caption="fig. 2 — the turn cycle · every intent passes<br>through the orchestrator · no orbit repeats"><AmphoreusMark height={120} /></Plate>`. In `projects.ts`, delete the `image: "/projects/Amphoreus.jpeg"` line (the mark renders wherever the Amphoreus entry appears; `videoId` thumbnail remains the video poster source on /projects). Delete `public/projects/Amphoreus.jpeg`.

- [ ] **Step 3: Favicon**

Generate a static Lorenz-curve SVG (single amber `#996b16` polyline of the attractor's XZ projection on transparent bg — compute the 16 000-point trajectory once with the same constants σ=10 ρ=28 β=8/3 in a scratch node script, decimate to ~600 points, write as `<polyline>`), save as `public/favicon.svg`; rasterize 32px and 180px PNGs over `#faf8f3`:

```bash
npx tsx scripts/gen-favicon.ts   # writes favicon.svg
# then rasterize (macOS):
qlmanage -t -s 180 -o /tmp public/favicon.svg 2>/dev/null || true
sips -Z 180 -s format png /tmp/favicon.svg.png --out public/apple-touch-icon.png
sips -Z 32  -s format png /tmp/favicon.svg.png --out public/favicon-32.png
```

(Write `scripts/gen-favicon.ts` as part of this step; commit it too.)

- [ ] **Step 4: Verify + commit**

Build exit 0; homepage fig. 2 shows the lemniscate with ORCH/DM/PLAYERS ×13 labels uncrowded on both themes; browser tab shows the curve.

```bash
git add -A && git commit -m "redesign: original Amphoreus lemniscate mark + Lorenz favicon; drop borrowed key art"
```

---

### Task 7: Work page (/projects)

**Files:**
- Modify: `src/pages/projects.astro` (full rewrite)
- Modify: `src/components/VideoEmbed.astro`
- Delete: `src/components/Icon.astro` (last consumer gone after Tasks 5–7; if any import remains, this task removes it)

**Interfaces:**
- Consumes: `PageMast`, `Plate`, `AmphoreusMark`, `VideoEmbed`, `projects.ts`.
- Produces: ledger + dossier page per mock Appendix C + Appendix A.

- [ ] **Step 1: Modify `VideoEmbed.astro`**

Keep the click-to-play YouTube facade logic exactly as-is; change only presentation: wrap in `.plate`; poster `<img>` gets the duotone (grayscale filter + amber `mix-blend-mode:color` overlay at .45); the play affordance becomes the mock's square amber-bordered `▶` (no circles, no shadows). On click (iframe injected), the overlay and filter elements are removed/hidden so **playback is untouched**.

- [ ] **Step 2: Rewrite `projects.astro`**

- `<PageMast crumb="WORK" title="Work" sub="Systems that can be measured — retrieval pipelines, multi-agent engines, and the evaluation harnesses that keep them honest." kv={\`${projects.length} PROJECTS · 2023 — ONGOING · 2 PEER-REVIEWED\`} />`
- Ledger `<table class="ledger">`: row per project — `P-0{i+1}` / title (anchor link `#${slug ?? i}`) / tag uppercased / status (`● ONGOING · 2026` amber LED only when description marks it ongoing — drive from `year` + a new optional `status?: "ongoing" | "published"` field added to the `Project` type with values set for the three projects).
- Dossiers in order: `<h2>` serif title, mono stack line (`2026 · ONGOING · PYTHON / CHROMADB / MULTI-PROVIDER LLM` for Amphoreus — add optional `stack?: string` to `Project` and fill for all three), `plate 1` = `<VideoEmbed>` for Amphoreus / duotoned `<img>` plate for the other two, datasheet `<table>` from `highlights` (mono field label column + sans detail column, hairline rows), links row (demo / write-up / DOI).

- [ ] **Step 3: Verify + commit**

Build exit 0. Dev both themes: ledger scans; anchors jump; Amphoreus poster is duotoned but **video plays in full color**; no Material icons anywhere (`grep -r "material-symbols\|Icon.astro" src` returns nothing).

```bash
git add -A && git commit -m "redesign: work page — ledger + dossiers, duotone posters with untouched playback"
```

---

### Task 8: Writing index (/blog)

**Files:**
- Modify: `src/pages/blog/index.astro` (full rewrite)
- Delete: `src/components/SeriesBadge.astro`

**Interfaces:**
- Consumes: `PageMast`, `readingTime`, blog collection.
- Produces: writing index per mock Appendix D.

- [ ] **Step 1: Rewrite `blog/index.astro`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import PageMast from "../../components/PageMast.astro";
import { getCollection } from "astro:content";
import { readingTime } from "../../lib/reading-time";

const posts = (await getCollection("blog", ({ data }) => !data.draft));
const series = posts.filter(p => p.data.series === "rag-revisited")
  .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
const standalone = posts.filter(p => !p.data.series)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const byYear = Object.entries(Object.groupBy(standalone, p => p.data.date.getFullYear()))
  .sort((a, b) => Number(b[0]) - Number(a[0]));
const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase();
---
```

Markup: `<PageMast crumb="WRITING" title="Writing" sub="Blurbs on retrieval, agents, and evaluation — plus the occasional off-the-clock note." kv={\`${posts.length} POSTS · 1 SERIES · SINCE JUN 2026\`} />`; series block (`.series-head` + intro line + `.wpost` rows: `№ {String(order).padStart(2,"0")}` / linked title / `heroPhrase` italic deck / `{fmt(date)} · {readingTime(post.body)} MIN`); then per-year `STANDALONE · {year}` labels with `.wpost` rows (✳ marker, description-derived deck: use `heroPhrase ?? ""` and omit the deck span when absent).

- [ ] **Step 2: Verify + commit**

Build exit 0. Index shows 6 series rows in № 00–05 order with phrases as decks, Amphoreus post under `STANDALONE · 2026`; reading times are 3–6 min matching word counts; no thumbnails.

```bash
git add -A && git commit -m "redesign: writing index — series ledger with hero-phrase decks, year-grouped standalone"
```

---

### Task 9: Article pages (/blog/[slug])

**Files:**
- Modify: `src/pages/blog/[...slug].astro` (full rewrite of template; keep `getStaticPaths`)
- Modify: `src/components/SeriesNav.astro` (restyle to house language)

**Interfaces:**
- Consumes: `Plate`, blog collection, `readingTime`.
- Produces: article header order per spec §6.7 + prose styles.

- [ ] **Step 1: Rewrite the article template**

Header, in order (all fields optional-safe):
1. `heroKicker` → `<div class="kicker mono">` (amber, letterspaced — mock Appendix B).
2. `heroPhrase` (fall back to `title` when absent) → `<h1>` ~30px serif.
3. `heroTagline` → small sans `--sub` line.
4. `image` (unless `hideHero`) → `<Plate caption={heroCredit ? \`photo: ${...}\` : "fig. — " + title}>` **full color** (no duotone — article top per spec §7); `heroCredit` HTML goes through `set:html` in the caption.
5. Byline row (mono): `{fmt(date)} · {readingTime(post.body)} MIN · {category.toUpperCase()}`.
6. When `heroPhrase` exists, render the real `title` as the first body line (serif italic, `--sub`) so the descriptive title still appears on-page.

Prose styles (scoped `<style>` or `.prose-journal` in global.css): serif 17px/1.75 at 65ch; `h2` = serif 22px with mono amber `§`-less hairline treatment (border-top `--line`, padding-top); `code`/`pre` in `--font-mono` with `--sel` background, no radius; `blockquote` hairline left border; `img` inside articles auto-wrapped by `.plate`-equivalent rule `article img{ border:1px solid var(--line-strong); }`; links `color:var(--signal)`.

- [ ] **Step 2: Restyle `SeriesNav.astro`**

Keep its prev/next/hub logic; restyle to `.wpost`-like hairline rows, mono labels `← № 02 · COVERAGE-BOUNDED RECALL` / `SERIES HUB` / `№ 04 →`. No pills, no cards.

- [ ] **Step 3: Verify + commit**

Build exit 0. Open `/blog/atomicity-is-the-target-not-the-algorithm`: kicker `RAG · REVISITED · Nº 01`, phrase "Where you put the knife." as the headline, knife photo **full color** in a plate with the Unsplash credit as caption; body at 65ch; series nav hairline rows. Check the Amphoreus post (no kicker/phrase → plain title headline path works).

```bash
git add -A && git commit -m "redesign: article header system — kicker/phrase/tagline/plate-credit, journal prose"
```

---

### Task 10: Papers page (/publications)

**Files:**
- Modify: `src/pages/publications.astro` (full rewrite)
- Modify: `src/data/publications.ts` (add fields)

**Interfaces:**
- Consumes: `PageMast`, `publications.ts`.
- Produces: reference-list page per mock Appendix E with working `[ CITE ]`.

- [ ] **Step 1: Extend `publications.ts`**

Add to the `Publication` type: `year: string; kind: string; bibtex: string;` and fill for all three entries (bibtex assembled from the real metadata already in the file, e.g.:

```ts
bibtex: `@article{misra2024adagen,
  title={AdaGen: Adaptive Generalized Knowledge Transfer Framework for Sensor-Based Surface Classification for Wheelchair Routing},
  author={Misra, Vanshika and Menon, Shivashankar S and others},
  journal={SN Computer Science}, volume={5}, number={7}, pages={820}, year={2024},
  doi={10.1007/s42979-024-03181-w}
}`,
```

— same pattern for the RAA 2023 (`doi:10.1088/1674-4527/acd09f`, 23.6 p. 065021) and ASR 2023 (`doi:10.1016/j.asr.2022.07.086`, 71.1 pp. 1059–1073) entries. Author lists: keep `et al.` — or copy the full lists from the DOIs if desired; not a blocker.)

- [ ] **Step 2: Rewrite `publications.astro`**

Per entry (mock Appendix E): mono kicker `{year} · {kind.toUpperCase()}`, serif title, author/venue line with own name `<b>`-weighted, amber DOI link, and a `[ CITE ]` button toggling a `<pre class="mono">` BibTeX block inside a `.plate` frame (inline `<script>` per entry or one delegated listener; also a "copied ✓" via `navigator.clipboard.writeText` on click of the block).

- [ ] **Step 3: Verify + commit**

Build exit 0. Three entries, real DOIs; `[ CITE ]` opens BibTeX, click copies.

```bash
git add -A && git commit -m "redesign: papers page — reference list with BibTeX cite blocks"
```

---

### Task 11: Resume page (/resume)

**Files:**
- Modify: `src/pages/resume.astro` (full rewrite)

**Interfaces:**
- Consumes: `PageMast`, `resume.ts` (unchanged).
- Produces: typeset CV per mock Appendix F.

- [ ] **Step 1: Rewrite `resume.astro`**

- `<PageMast crumb="RESUME" title="Resume" sub={approach}>` with kv slot: `LAST REVISED JUL 2026 · <a href={resumePdf}>PDF ↓</a>` (render the revision date from `buildInfo()`'s commit month instead of hardcoding: `LAST REVISED {month yyyy}`).
- Section heads `.sh` with `F.1 EXPERIENCE / F.2 EDUCATION / F.3 SKILLS` → use plain `01 / 02 / 03` numerals (the F.x was appendix labeling in the mock, not site content).
- Experience: `.cv` grid rows from `experience` — mono period (+ bordered `tag` when present, e.g. INDEPENDENT PURSUIT), serif `role`, sans `org`, summary `<p>`, `highlights` as em-dash `<li>`s. Ignore `icon` fields.
- Education: same `.cv` row from `education`.
- Skills: `.skillrow` per group — `group.toUpperCase()` left, `items.join(" · ").toUpperCase()` right. All five groups (incl. Programming, Policy & Analysis).

- [ ] **Step 2: Verify + commit**

Build exit 0. Every entry/highlight from `resume.ts` present verbatim; single column under 720px.

```bash
git add -A && git commit -m "redesign: resume page — typeset CV, mono period column, no timeline graphics"
```

---

### Task 12: About page (/about)

**Files:**
- Create: `src/pages/about.astro`

**Interfaces:**
- Consumes: `PageMast`, `nowStatus`, `socials`, `site`.
- Produces: `/about` route per mock Appendix G.

- [ ] **Step 1: Write `about.astro`**

`<PageMast crumb="ABOUT" title="About" />`, then the four v12 letter paragraphs **copied verbatim from the mock Appendix G** (attractor-question spine with "most recently in Amphoreus…"; the grounded UPSC-lens paragraph; the Talos Principle line; the 6c-ii closer), at 56ch serif 16.5px/1.8. Then NOW list (from `nowStatus` + contact from `site.email`/`socials`, amber LED on the building line) and the boxed COLOPHON (mock text: "Set in Newsreader and a Berkeley-class mono…" → update to "…and JetBrains Mono…"; keep "Drag it."). Link "the mark at the top of this page" text to `/` (the attractor lives on the homepage).

- [ ] **Step 2: Verify + commit**

Build exit 0. `/about` renders the letter both themes; nav ABOUT highlights the route.

```bash
git add -A && git commit -m "redesign: about page — the letter, NOW list, colophon"
```

---

### Task 13: Blog diagram restyle (8 SVGs)

**Files:**
- Modify: `public/blog/agent-architecture.svg`, `anisotropy-cone.svg`, `bloom-router.svg`, `chunking-knife.svg`, `complementarity-sets.svg`, `coverage-set.svg`, `eval-index-card.svg`, `rag-pipeline-map.svg`, `score-histogram.svg`

**Interfaces:**
- Consumes: token hex values (SVGs are static files; they can't read CSS vars when loaded via `<img>` — hardcode the LIGHT palette and rely on the plate frame to unify; dark-theme unification comes from the article `img` hairline treatment, acceptable per spec tier-2).

**Restyle rules (apply to each file, preserving every label's text and the diagram's information design):**
- Background `#faf8f3` (no white cards, no `rx` rounded rects — set all `rx` to 0).
- Ink `#211f1b`, secondary `#5f594e`, metadata/captions `#7a7365`, hairlines `#c9c2b2`.
- The red/green semantic pair becomes: wrong/costly = `#8a3b2e` (muted rust), right/clean = `#3d6b4f` (muted green) — semantic color stays separate from the amber accent per artifact-design rule; amber `#996b16` only for emphasis arrows/markers.
- `font-family="Georgia, serif"` for titles/phrases, `font-family="Menlo, monospace"` at 11–12px letter-spaced for labels — mirroring the site's serif/mono roles.
- Footer caption line inside each SVG moves out: delete it (the article's `<figcaption>`/plate caption carries it).

- [ ] **Step 1–8:** One SVG at a time: restyle per rules, open in browser next to the article page, verify labels legible on paper bg, then move to the next. (chunking-knife.svg is the reference case: two panels stay, rounded corners go, red/green → rust/green, Helvetica → Georgia/Menlo.)

- [ ] **Step 9: Verify + commit**

All 9 SVG diagrams open with paper bg / zero rounded rects (`grep -L 'rx="0"' — spot check`), articles render them cleanly inside plates.

```bash
git add -A && git commit -m "redesign: restyle blog diagrams to house language — paper ground, serif/mono, rust/green semantics"
```

---

### Task 14: QA sweep + cleanup

**Files:**
- Modify: anything the sweep flags; Delete: dead files.

- [ ] **Step 1: Dead code sweep**

```bash
grep -rn "grain\|noise-bg\|Material\|material-symbols\|surface-container\|on-primary\|Plus Jakarta\|Literata\|fonts.googleapis" src/ tailwind.config.mjs
```
Expected: no hits (fix any). Confirm deleted: `Icon.astro`, `SeriesBadge.astro`, `Amphoreus.jpeg`. Confirm `LorenzHero` popover CSS gone.

- [ ] **Step 2: Cross-page QA (both themes, at 375 / 720 / 1000 / 1440 px)**

- No horizontal scrollbar on any page at any width.
- Masthead headline legible over attractor at 900–1100px.
- Ledger drops FIELD column, `.wpost` restacks, `.cv` single-column at ≤720px.
- Amber audit: view each page and confirm amber appears only on live/interactive/numeral elements.
- Video: play the Amphoreus demo — full color, no overlay.
- Keyboard: tab through nav, theme toggle, `why?`, `[ CITE ]` — visible focus (add `:focus-visible{ outline:1px solid var(--signal); outline-offset:2px; }` to global.css in this task).
- `prefers-reduced-motion`: attractor renders complete and static (existing behavior — verify it survived Task 4).

- [ ] **Step 3: Meta/OG check**

`npm run build && npx astro preview`: page titles correct; blog OG images still point at hero images; sitemap builds.

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "redesign: QA sweep — focus states, dead-code removal, responsive fixes"
```

---

## Self-Review Notes

- **Spec coverage:** §4 tokens → T1; §5 typography → T1; §6.1 → T5; §6.2 → T7; §6.3 → T8; §6.4 → T10; §6.5 → T11; §6.6 → T12; §6.7 → T9; §7 plates/duotone/mark/favicon/OG → T3/T5/T6/T7/T13 (OG composition per post deferred — existing hero-image OG retained, spec §7 "composed OG images" is listed as a follow-up, not shipped here: **the only consciously dropped item**, flag to user); §8 Lorenz → T4+T5; §9 interaction → T2/T5/T14; §10 build arch → T1/T3; §11 out-of-scope respected.
- **Type consistency:** `readingTime(body: string): number` used in T8/T9; `nowStatus` shape used in T5/T12; `Plate` props `{caption, full?}` (`full` unused — kept for the T7 full-width case via CSS, acceptable); `Project` gains `status?`/`stack?` in T7 only.
- **Route decision** recorded in Global Constraints (keep paths, relabel nav).
