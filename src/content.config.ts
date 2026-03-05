import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      pinned: z.boolean().default(false),
      published: z.boolean().default(false),
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
    }),
});

const jams = defineCollection({
  // Load Markdown and MDX files in the `src/content/games/` directory.
  loader: glob({ base: "./src/content/jams", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      pinned: z.boolean().default(false),
      published: z.boolean().default(false),
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      heroImage: image().optional(),
      jamName: z.string().optional(), // jam link
      jamLink: z.string().url().optional(), // jam name
      videoLink: z.string().url().optional(), // youtube
      playLink: z.string().url().optional(), // itch
      repoLink: z.string().url().optional(), // github
    }),
});

export const collections = { blog, jams };
