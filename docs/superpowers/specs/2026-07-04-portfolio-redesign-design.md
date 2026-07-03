# Portfolio Redesign — Design Spec

**Date:** 2026-07-04
**Status:** Approved direction, pending user review of this document
**Reference mock:** `redesign-v2-full.html` (artifact, label v12-prose-fixes) — the mock is the visual source of truth; this document records the decisions and rules behind it.

## 1. Problem

The live site was assembled from Google Stitch / Material 3 templates. Feedback: "feels extremely cheap, AI-generated, and low effort." Symptoms: gradient blobs, morphing pebble shapes, giant border radii, icon-font decorations, hero→cards→timeline template skeleton, decorative stock imagery, M3 token soup.

## 2. Intent

A portfolio that reads as a personal, authored document — "a peek into my various dimensions" — while serving its functions: a fast way for hiring managers, engineers, friends, and family to check projects, resume, publications, and blog. The blog matters but is not the focus.

## 3. Design thesis

**Masthead → index.** The site is a typeset technical journal, not a landing page. Dense typographic lists instead of cards; metadata (dates, numbering, reading times, DOIs) treated as design material; one generative mark as the single memorable move; personal warmth carried by *content* (status strip, Now list, About letter, authored hero phrases) rather than decoration.

Reference lock (from research):
- **Primary:** Paco Coursey / Rauno Freiberg — masthead→index structure, dense typographic lists, no cards.
- **Borrowed (metadata only):** US Graphics / Oxide instrument vernacular — hairline rules, mono metadata, § numbering, datasheet tables.
- **Borrowed:** Lil'Log metadata precision — dates, reading times, series numbers, year-grouped archive.
- **Reject:** cards, rounded containers, shadows, gradient blobs, icon fonts, decorative imagery, centered hero layouts.

## 4. Token system — one identity, two grounds

CSS custom properties; `prefers-color-scheme` default with `data-theme` override (toggle stamps the root; overrides must win in both directions).

| Token | Light ("journal on paper") | Dark ("observatory") |
|---|---|---|
| `--bg` | `#faf8f3` | `#0b0e15` |
| `--ink` | `#211f1b` | `#e8ecf2` |
| `--sub` | `#5f594e` | `#9aa5b5` |
| `--meta` | `#7a7365` (4.4:1) | `#74839c` (5.0:1) |
| `--line` | `#e5e0d5` | `#1c2230` |
| `--line-strong` | `#c9c2b2` | `#323c50` |
| `--signal` | `#996b16` | `#e0a83c` |
| `--signal-bright` | `#b07d1a` | `#f2c05e` |
| `--trail` | `#8a5a10` | `#d69a2e` |
| `--sel` | `#f0ead9` | `#1a2130` |

**Accent role rule (hard):** amber (`--signal`) marks only (a) live things (LED, ongoing status), (b) interactive things (links, hovers, DOIs, toggles), (c) the system's numerals (§ numbers, ledger P-numbers). No new roles may be added; it is at its ceiling.

**Contrast rule:** every token/role pair ≥ 4.5:1 at its smallest used size (verified for `--meta`; re-verify if any hex changes).

## 5. Typography

Three roles, self-hosted (no font CDNs):
- **Serif (voice):** Newsreader (first choice) or Source Serif 4 — headlines, body prose, titles. Weight 400; hierarchy by size, not weight.
- **Sans (support):** Helvetica-class — descriptions, datasheet cells, secondary prose.
- **Mono (instrument):** Berkeley-class (Commit Mono / JetBrains Mono) — all metadata: captions, dates, labels, nav, status strip, footer.

Rules: `text-wrap: balance` on headings; body prose ≤ 56–65ch; uppercase mono labels carry letter-spacing (.05–.16em); no border-radius anywhere; no box shadows.

## 6. Structure

Nav: `WORK · WRITING · PAPERS · RESUME · ABOUT` (option recorded, not exercised: fold PAPERS into WORK if nav needs slimming).

### 6.1 Homepage
1. Top bar: name + mono nav.
2. Masthead: headline serif, ~52ch intro, **fig. 1** — the interactive Lorenz attractor (see §8) bleeding right, with mono caption `fig. 1 — lorenz attractor · σ=10, ρ=28, β=8/3 · ● live · why?` — `why?` toggles an inline footnote (childhood chaos-theory text + link), replacing the old `?` popover.
3. Status strip: mono cells — availability LED, last commit (computed at build from git/GitHub; site rebuilds on push), currently building, reading (from a hand-maintained `now.ts`; drop the cell rather than let it go stale). Wraps, never scrolls.
4. § 01 Selected Work — index entries (grid `1fr 200px`): serif title, sans description, spec block (hairline left border), mono links; side column holds a plate + mono meta (year/status/field).
5. § 02 Writing — series head + numbered rows (№ 00–05, real dates); LATEST block for standalone posts.
6. § 03 Publications — all three papers, one-liners with real DOIs.
7. § 04 About — two-paragraph excerpt of the About letter + NOW list.
8. Footer/colophon line.

### 6.2 Work (`/work`)
Ledger table first (P-01…, title, field, status; amber ● only for currently-running work), then per-project dossiers in ledger order: serif title, mono stack line, **plate 1** full-width demo video, datasheet table (mono field labels, sans cells). No cards.

### 6.3 Writing (`/writing`)
Page mast (crumb, title, sub, mono kv line + RSS). Series block first with intro; each row: № / serif title / italic **hero phrase** as deck / mono date + reading time (computed from word count). Standalone posts under year labels after the series. No thumbnails at index level.

### 6.4 Papers (`/papers`)
Reference-list treatment: mono year/type kicker, serif full title, author line with own name weighted, italic venue, mono amber DOI, `[ CITE ]` flips open a copy-ready BibTeX block in a plate frame.

### 6.5 Resume (`/resume`)
Typeset CV: grid `150px 1fr` — mono period column left, serif role + sans org/highlights right; em-dash lists; the grid *is* the timeline (no dots/rails). UPSC chapter gets bordered `INDEPENDENT PURSUIT` tag. Skills as mono ledger rows. `PDF ↓` in the page-mast kv line. Content mirrors `resume.ts` exactly (incl. Gen AI, Programming group).

### 6.6 About (`/about`)
One column of serif prose at 56ch — a letter (final text as in mock v12: attractor-question spine → grounded road/UPSC-lens paragraph → Talos Principle media line → 6c-ii closer). Then NOW list (LED on the live item) and boxed COLOPHON. Homepage § 04 is an excerpt in the same voice.

### 6.7 Article pages
Header order: mono amber kicker (`RAG · REVISITED · Nº 01`) → hero *phrase* as large serif headline → tagline in small sans → hero photo full-color in plate frame → credit as plate caption. Frontmatter schema (`heroKicker/heroPhrase/heroTagline/heroCredit/series/order`) unchanged. Long descriptive title serves SEO/OG, not the visual header.

## 7. Imagery — the plate system

Every image is a numbered, captioned figure in a uniform hairline frame (`--line-strong`), caption in mono, right-aligned. Three tiers:
1. **Evidence** — demo stills, paper figures, survey imagery. Real artifacts only.
2. **Explanation** — the 8 blog SVG diagrams, restyled to house language (tokens, serif/mono, hairlines; replacing the current white-card/rounded/red-green idiom).
3. **Metaphor** — art-directed stock heroes, blog-only, always with kicker/phrase/tagline/credit authored around them.

Rules:
- **Duotone** (`grayscale + --signal color-blend ~.45`) only in shared/index contexts and on video *poster stills*. Full color at the top of articles. **Video playback is never filtered** (hard constraint).
- Hero photos appear exactly once (article top); indexes carry the phrase as text instead.
- `Amphoreus.jpeg` (borrowed HSR key art) is **replaced** by the original lemniscate mark: dense multi-orbit band drawn with the same alpha-ramp technique as the masthead attractor; ORCH node at the crossing (amber), DM node on the left lobe, a trio of dots + `PLAYERS ×13` label on the right lobe (label offset computed from the curve so it can't collide at any size). Preserves the infinity homage; diagrams the real engine topology.
- Favicon: Lorenz mark replaces the pebble.
- OG images: kicker + phrase + hero photo composed per post.

## 8. The Lorenz attractor (fig. 1)

The existing interactive `LorenzHero.astro` carries over **mechanically identical**: 3D turntable rotation, drag-to-reorient with 3s ease-back, comet particles with glowing trails, breathing opacity, dot lattice, reduced-motion instant draw. Changes are dressing only:
- Palettes re-pointed at the new tokens (amber `--trail` family on both grounds; quieter lattice dots).
- The 48px-radius pebble frame is removed — it floats unframed in the masthead as fig. 1.
- The `?` button/popover is replaced by the caption `why?` footnote (§6.1).
- Theme redraw via existing MutationObserver, watching the new `data-theme` attribute.

## 9. Interaction & motion

- Theme toggle in the top bar (mono `◐` affordance); persists via `localStorage`, defaults to OS preference.
- Motion budget: the attractor is the only ambient animation. Everything else is hover color shifts and the `[ CITE ]` / `why?` toggles. `prefers-reduced-motion` renders the attractor complete and static.
- Hover rule: links shift to `--signal`; no underline-slide effects, no scale transforms.

## 10. Build & content architecture

- Astro 4 + Tailwind: **replace** the M3 token soup in `tailwind.config` / `global.css` with the §4 tokens; delete pebble morphs, grain overlays, gradient blobs, Material icon font.
- Fonts self-hosted via `@font-face`, `font-display: swap`, subsetted.
- Data files (`projects.ts`, `resume.ts`, `publications.ts`, `site.ts`) remain the single source of truth; add `now.ts` (status strip) and a build-time last-commit lookup.
- Blog collection schema unchanged; reading time computed at build.
- Routes: keep existing (`/projects` → `/work` etc. — rename with redirects, or keep old paths; decide at plan stage).
- QA checkpoints: masthead headline legibility over the attractor at 900–1100px; mobile collapse (ledger drops field column, writing rows restack, CV goes single-column); both themes on every page; no horizontal scroll at any width.

## 11. Out of scope

- No CMS, no trackers/analytics changes, no new content beyond the About letter and re-dressed diagrams.
- No changes to blog post bodies or video hosting.
- PAPERS→WORK nav merge: recorded option only.

## 12. Decision ledger (traceability)

| Decision | Source |
|---|---|
| Masthead→index skeleton | Paco/Rauno research; user ranked directions 6=5 first |
| Mono metadata / § numbering / datasheets | US Graphics/Oxide (metadata role only) |
| Phrase-as-deck writing index, no thumbnails | User: "loved the caption/subcaption stuff"; Lil'Log density |
| Duotone posters only, playback untouched | User hard constraint |
| Lemniscate Amphoreus mark | User: keep infinity homage, must be original; topology from amphoreus-dnd README |
| Trio + ×13 label | User: 13 dots too noisy; label collision fixed |
| Interactive attractor kept identical | User request; existing component |
| `--meta` darkened | WCAG 4.5:1 audit |
| About letter voice/content | User answers (spine 4 + 6c-ii; UPSC lens per original resume text; Talos Principle; "Shivashankar") |
