import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

// Resolve each design-system brick by its package NAME (not a relative path), so
// the story globs survive this package moving anywhere in the tree. `require.resolve`
// follows the pnpm workspace link to the brick's real dir — same trick as
// Storybook's own `getAbsolutePath`.
const require = createRequire(import.meta.url);
const brickStories = (pkg: string) =>
  `${dirname(require.resolve(`${pkg}/package.json`))}/src/**/*.stories.@(ts|tsx)`;

// Mock `next-intl` (+ `next-intl/server`) so the two renderers that read
// translations (GalleryCarousel client, QuoteList server) resolve without a
// real request/provider. See `.storybook/next-intl-mock.tsx`.
const nextIntlMock = fileURLToPath(new URL("./next-intl-mock.tsx", import.meta.url));
// Shiki's WASM highlighter hangs in the browser-only canvas; stub it so
// CodeBlock stories render (real highlighting is server-side in the app).
const shikiMock = fileURLToPath(new URL("./shiki-mock.ts", import.meta.url));
// Sibling-brick stories import `storybook/test` for their `play` fns, but
// `storybook` is a dep of THIS package only (pnpm strict), so it doesn't
// resolve from `../ui` / `../ui-components`. Anchor a resolve from this file so
// vite finds it here — with browser export-conditions (a raw require.resolve
// would pin the Node build and crash the browser bundle on `tty.isatty`).
const storybookAnchor = fileURLToPath(import.meta.url);

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs-vite", options: {} },
  // Colocated stories live in the design-system bricks (resolved by name); token
  // docs live here in `../stories`.
  stories: [
    "../stories/**/*.mdx",
    brickStories("@indiecrafts/packages-web-ui"),
    brickStories("@indiecrafts/packages-web-ui-components"),
    brickStories("@indiecrafts/packages-web-announcement"),
    brickStories("@indiecrafts/packages-web-locale-suggest"),
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
      { find: /^next-intl\/navigation$/, replacement: nextIntlMock },
      { find: /^shiki$/, replacement: shikiMock },
      {
        find: /^storybook\/test$/,
        replacement: "storybook/test",
        async customResolver(source: string) {
          // Resolve from THIS package via vite so browser conditions apply.
          const resolved = await this.resolve(source, storybookAnchor, {
            skipSelf: true,
          });
          return resolved?.id;
        },
      },
      ...existing,
    ];
    return cfg;
  },
};

export default config;
