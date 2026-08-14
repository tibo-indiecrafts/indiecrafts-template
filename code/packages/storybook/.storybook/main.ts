import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

// Mock `next-intl` (+ `next-intl/server`) so the two renderers that read
// translations (GalleryCarousel client, QuoteList server) resolve without a
// real request/provider. See `.storybook/next-intl-mock.tsx`.
const nextIntlMock = fileURLToPath(new URL("./next-intl-mock.tsx", import.meta.url));
// Shiki's WASM highlighter hangs in the browser-only canvas; stub it so
// CodeBlock stories render (real highlighting is server-side in the app).
const shikiMock = fileURLToPath(new URL("./shiki-mock.ts", import.meta.url));

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs-vite", options: {} },
  // Colocated stories live in the sibling packages; token docs live here.
  stories: [
    "../stories/**/*.mdx",
    "../../ui/src/**/*.stories.@(ts|tsx)",
    "../../ui-components/src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-a11y", // axe on every story (surfaced in the Storybook UI + enforced by addon-vitest)
    "@storybook/addon-vitest", // run every story as a Vitest component test (browser mode)
  ],
  // Render async React Server Components (QuoteList, CodeBlock).
  features: { experimentalRSC: true },
  async viteFinal(cfg) {
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    cfg.plugins = cfg.plugins ?? [];
    cfg.plugins.push(tailwindcss());

    cfg.resolve = cfg.resolve ?? {};
    const alias = cfg.resolve.alias;
    // Normalize to the array form and use EXACT regex matches — an object
    // alias for "next-intl" is prefix-greedy and would rewrite
    // "next-intl/server" → "<mock>/server". `/^next-intl$/` avoids that.
    const existing = Array.isArray(alias)
      ? alias
      : Object.entries(alias ?? {}).map(([find, replacement]) => ({ find, replacement }));
    cfg.resolve.alias = [
      { find: /^next-intl$/, replacement: nextIntlMock },
      { find: /^next-intl\/server$/, replacement: nextIntlMock },
      { find: /^shiki$/, replacement: shikiMock },
      ...existing,
    ];
    return cfg;
  },
};

export default config;
