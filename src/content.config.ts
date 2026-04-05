import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const common = {
  published: z.boolean().default(true),
  title: z.string(),
  description: z.string(),
  publishedDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
} as const;

const apps = defineCollection({
  loader: glob({ base: "./src/content/apps", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      ...common,
      steamLink: z.url().optional(),
      itchLink: z.url().optional(),
      heroImage: image().optional(),
    }),
});

const articles = defineCollection({
  loader: glob({ base: "./src/content/articles", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      ...common,
      heroImage: image().optional(),
      series: z.string(),
    }),
});

const assets = defineCollection({
  loader: glob({ base: "./src/content/assets", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      ...common,
      itchLink: z.url().optional(),
      heroImage: image().optional(),
    }),
});

// Actual games you can buy/play and jams
const games = defineCollection({
  loader: glob({ base: "./src/content/games", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      pinned: z.boolean().default(false),
      ...common,
      heroImage: image().optional(),
      jamName: z.string().optional(), // jam link
      jamLink: z.url().optional(), // jam name
      videoLink: z.url().optional(), // youtube
      itchLink: z.url().optional(), // itch
      steamLink: z.url().optional(), // steam
      sourceLink: z.url().optional(), // github
    }),
});

// Our open source libraries, plugins, etc
const repositories = defineCollection({
  loader: glob({
    base: "./src/content/repositories",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) =>
    z.object({
      ...common,
      gitLink: z.url().optional(),
      heroImage: image().optional(),
    }),
});

// podcasts (if we had one)
const podcasts = defineCollection({
  loader: glob({ base: "./src/content/podcasts", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      ...common,
      heroImage: image().optional(),
    }),
});

// Blog posts, dev logs, etc
const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      ...common,
      heroImage: image().optional(),
      // TODO tags and/or category (devlog)
    }),
});

// Videos
const videos = defineCollection({
  loader: glob({ base: "./src/content/videos", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      ...common,
      youtubeLink: z.url().optional(),
      tiktokLink: z.url().optional(),
      twitchLink: z.url().optional(),
      heroImage: image().optional(),
    }),
});

// Series in which an article (and possible other things are grouped under)
const series = defineCollection({
  loader: glob({ base: "./src/content/series", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      ...common,
      heroImage: image().optional(),
      sourceLink: z.url().optional(), // github - I'm hoping we can get away with one per series
    }),
});

//#region Exports

export const COLLECTIONS = [
  // Content
  "apps",
  "articles",
  "assets",
  "games",
  "podcasts",
  "posts",
  "repositories",
  "videos",
  // Info on series, tags, etc
  "series",
];

export const collections = {
  apps,
  articles,
  assets,
  games,
  podcasts,
  posts,
  repositories,
  videos,
  series,
};
