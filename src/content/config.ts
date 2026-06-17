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
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
