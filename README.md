# Personal Portfolio

A warm, tactile personal portfolio built with [Astro](https://astro.build) +
Tailwind CSS. The visual design comes from the **Warm & Organic** theme of a
Google Stitch project; the content architecture (file/data‑driven, central config,
Markdown blog, SEO/OpenGraph) is inspired by
[magic-portfolio](https://github.com/once-ui-system/magic-portfolio).

Light mode is a warm terracotta/sage palette; dark mode is a Midnight & Ochre
variant. The theme toggle persists your choice and respects system preference.

## Pages

| Route            | Source                          |
| ---------------- | ------------------------------- |
| `/`              | `src/pages/index.astro`         |
| `/projects`      | `src/pages/projects.astro`      |
| `/resume`        | `src/pages/resume.astro`        |
| `/publications`  | `src/pages/publications.astro`  |
| `/blog`          | `src/pages/blog/index.astro`    |
| `/blog/<slug>`   | `src/pages/blog/[...slug].astro`|

## Develop

```bash
npm install     # first time only
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into dist/
npm run preview  # preview the production build locally
```

## Where to edit your content

Everything about "you" lives in a few plain files — no need to touch markup:

- **`src/config/site.ts`** — your name, brand, role, email, tagline, nav links,
  and social links (used across every page + SEO metadata).
- **`src/data/projects.ts`** — your projects (the first three featured ones show
  on the homepage; all show on `/projects`).
- **`src/data/resume.ts`** — experience, education, skills, "approach" blurb, and
  an optional resume PDF (drop a file in `public/` and set `resumePdf`).
- **`src/data/publications.ts`** — articles / papers / talks.
- **`src/content/blog/*.md`** — blog posts. **Add a post by adding a Markdown
  file**; the filename becomes the URL. Frontmatter fields:

  ```yaml
  ---
  title: "My Post Title"
  description: "One-sentence summary used in cards + SEO."
  date: 2024-10-12
  category: "Design Theory"
  featured: true        # optional — promotes it to the big hero card
  image: "/posts/x.jpg" # optional — URL or a file under /public
  draft: false          # optional — true hides it from the build
  ---
  ```

### Images

The placeholder images currently point at Google-hosted URLs from the original
design. Replace them with your own: drop files in `public/` (e.g.
`public/projects/botanica.jpg`) and reference them as `/projects/botanica.jpg`.

### Before deploying

Set your real domain in **`astro.config.mjs`** (`const SITE = ...`) so canonical
URLs, OpenGraph tags, and the sitemap are correct.

## Deploy (free hosting options)

This is a fully static site (`dist/`), so it hosts anywhere.

**Netlify / Vercel / Cloudflare Pages** — connect the repo and use:
- Build command: `npm run build`
- Publish/output directory: `dist`

**GitHub Pages** — build and push `dist/`, or use the official Astro Pages
action. If hosting under `https://user.github.io/repo/`, also set
`base: "/repo"` in `astro.config.mjs`.

**Manual** — run `npm run build` and upload the contents of `dist/` to any static
host or drag the folder onto Netlify Drop.

## Customizing the look

Design tokens are centralized:
- **Colors** (light + dark) — CSS variables in `src/styles/global.css`.
- **Fonts, spacing, radius, type scale** — `tailwind.config.mjs`.

Fonts are Plus Jakarta Sans (display/labels) + Literata (body), loaded from
Google Fonts in `src/layouts/BaseLayout.astro`.
