// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

import svelte from "@astrojs/svelte";
import node from "@astrojs/node";

import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  site: "https://cogisoft.dev",
  output: "server",
  adapter: node({ mode: "standalone" }),
  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: "svelte",
        autoInstall: false,
      }),
    ],
    ssr: {
      external: ["better-sqlite3"],
      noExternal: [
        /^bits-ui(\/|$)/,
        /^@lucide\/svelte(\/|$)/,
        /^svelte-sonner(\/|$)/,
        /^mode-watcher(\/|$)/,
        /^phosphor-svelte(\/|$)/,
        /^@internationalized\/date(\/|$)/,
      ],
    },
  },

  integrations: [
    svelte({
      prebundleSvelteLibraries: true,
    }),
    icon({
      iconDir: "src/assets/icons",
      include: {
        ph: ["*"],
        carbon: ["*"],
      },
    }),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
      syntaxHighlight: "shiki",
      shikiConfig: {
        themes: {
          light: "catppuccin-latte",
          dark: "catppuccin-mocha",
        },
        wrap: false,
      },
    }),
  ],

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
      wrap: false,
    },
  },
});
