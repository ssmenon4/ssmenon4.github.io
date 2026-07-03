import { defineCollection, z } from "astro:content";

/**
 * Blog collection. To publish a post, drop a Markdown file in
 * src/content/blog/your-slug.md with the frontmatter below.
 * The filename (minus .md) becomes the URL: /blog/your-slug
 */
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string().default("Writing"),
    image: z.string().optional(),
    // Set true when `image` is a diagram used only as the index thumbnail /
    // social preview, not as an in-article hero (the diagram is placed inline
    // instead). Suppresses the top-of-article hero render.
    hideHero: z.boolean().default(false),
    // Series grouping: `series` is a shared slug; `order` sets reading order,
    // with the hub/overview post at order 0 and parts numbered from 1.
    series: z.string().optional(),
    order: z.number().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
