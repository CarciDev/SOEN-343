import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
// See https://www.skeleton.dev/docs/purgecss for details on how to configure PurgeCSS (specificly for safelisting)
import { purgeCss } from "vite-plugin-tailwind-purgecss";

export default defineConfig({
  resolve: {
    alias: {
      ".prisma/client/index-browser":
        "./node_modules/.prisma/client/index-browser.js",
    },
  },
  plugins: [
    sveltekit(),
    purgeCss({
      safelist: {
        greedy: [/^hljs-/],
      },
    }),
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
