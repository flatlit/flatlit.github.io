// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import remarkBlockContainers from "remark-block-containers";

// https://astro.build/config
export default defineConfig({
  site: "https://flatlit.github.io",
  base: "/",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [
      [
        // Support
        // :::tip title
        // Hello
        // :::
        // tip is the type inbuilt are info、tip、warning、danger、details、code-group (??)
        remarkBlockContainers,
        // remarkBlockContainers gives us a some of control over created
        // We could apply some daisy styles here, but I'm controlling styling in styles/app.css
        {
          // containerClass: "block-default", // Default container style class (we could make this 'alert' for daisy)
          // containerType: "div", // Container tag type
          titleType: "h5", // Title tag type. Default is would be p but it's a heading
          // titleClass: "block-title", // Default title style class, (we could make this font-bold for daisy)
        }, // satisfies remarkBlockContainers.BlockContainersOptions,
      ],
    ],
    // rehypePlugins: [],
  },
});
