import { file, glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const labsCollection = defineCollection({
  loader: file("./src/content/labs.json"),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      link: z.string(),
      priority: z.number(),
      color: z.string(),
      featured: z.boolean(),
      deprecated: z.boolean().default(false),
      image: image().optional(),
    }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.date(),
      authors: z.array(z.string()).optional(),
      avatars: z.array(image()).optional(),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
  blog: blogCollection,
  labs: labsCollection,
};
