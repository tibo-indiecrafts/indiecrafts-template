import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

/**
 * Composition ref: the **website** surface's own Storybook. It runs with the
 * website app's `@/` alias (→ its `src/`), so surface components resolve their
 * app-internal imports for real — no cross-app `@/` collision with the main
 * (bricks) gallery. Composed into the main gallery via `refs` in `.storybook/main.ts`.
 * Stories are colocated in the website app (its `src` tree, `.stories.tsx` files).
 */
const configDir = fileURLToPath(new URL(".", import.meta.url));
const websiteSrc = fileURLToPath(
  new URL("../../../surfaces/website/src", import.meta.url),
);
// configDir-relative glob (an absolute glob makes addon-vitest discover 0 tests).
const websiteStories = `${relative(configDir, websiteSrc)}/**/*.stories.@(ts|tsx)`;
const nextIntlMock = fileURLToPath(
  new URL("../.storybook/next-intl-mock.tsx", import.meta.url),
);
// Clerk needs a live SDK + publishable key; stub it so the auth components render.
// `@indiecrafts/packages-web-auth` re-exports from `@clerk/nextjs`, so this alias
// covers the barrel too. See `../.storybook/clerk-mock.tsx`.
const clerkMock = fileURLToPath(
  new URL("../.storybook/clerk-mock.tsx", import.meta.url),
);
// `@portabletext/react` v7 is built with the React Compiler and imports the
// `react/compiler-runtime` subpath; `@storybook/nextjs-vite`'s own react-aliasing
// (matching the app's real Next.js react build) doesn't resolve that subpath
// cleanly here, and the failure is non-deterministic across runs (varies with
// which other stories share the dependency scan), crashing the whole browser
// session — not just the one story that reaches it (e.g. `DefaultLayout`/
// `PageSchemas` pull it in transitively via the Sanity readers' rich-text
// fields). No website story exercises real portable-text rendering, so a
// no-op stub sidesteps the instability entirely. See `../.storybook/portabletext-mock.tsx`.
const portabletextMock = fileURLToPath(
  new URL("../.storybook/portabletext-mock.tsx", import.meta.url),
);
// The website story files import `storybook/test` for their `play` fns, but
// `storybook` is a dep of the CENTRAL package only (pnpm strict), so it doesn't
// resolve from the website surface. Anchor a resolve from this file so vite
// finds it here — same trick as `.storybook/main.ts` (a raw require.resolve
// would pin the Node build and crash the browser bundle on `tty.isatty`).
const storybookAnchor = fileURLToPath(import.meta.url);

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs-vite", options: {} },
  stories: [websiteStories],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  async viteFinal(cfg) {
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    cfg.plugins = cfg.plugins ?? [];
    cfg.plugins.push(tailwindcss());

    // Auth is opt-in behind this key; AuthMenu renders nothing without it. Bind
    // a demo value so the Clerk-mock path renders in stories.
    cfg.define = {
      ...(cfg.define ?? {}),
      "process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": JSON.stringify("pk_test_storybook"),
      // `@indiecrafts/packages-web-sanity/env` throws at MODULE IMPORT time (not
      // call time) without these — merely importing `@/lib/seo/site-seo` (from
      // `jsonld.tsx`/`DefaultLayout.tsx`) pulls in the Sanity client. Bind demo
      // values so the import succeeds; no story here actually calls the Sanity
      // fetchers (the ones that do, e.g. `PageSchemas`, are `!test`).
      "process.env.NEXT_PUBLIC_SANITY_PROJECT_ID": JSON.stringify("storybook-demo"),
      "process.env.NEXT_PUBLIC_SANITY_DATASET": JSON.stringify("production"),
    };

    cfg.resolve = cfg.resolve ?? {};
    const existing = Array.isArray(cfg.resolve.alias)
      ? cfg.resolve.alias
      : Object.entries(cfg.resolve.alias ?? {}).map(([find, replacement]) => ({
          find,
          replacement,
        }));
    cfg.resolve.alias = [
      // The website app's `@/` → its own src. Scoped to THIS config, so no
      // collision with app/mobile (which mean a different root).
      { find: /^@\/(.*)$/, replacement: `${websiteSrc}/$1` },
      { find: /^next-intl$/, replacement: nextIntlMock },
      { find: /^next-intl\/server$/, replacement: nextIntlMock },
      { find: /^next-intl\/navigation$/, replacement: nextIntlMock },
      { find: /^@clerk\/nextjs$/, replacement: clerkMock },
      { find: /^@clerk\/nextjs\/server$/, replacement: clerkMock },
      { find: /^@portabletext\/react$/, replacement: portabletextMock },
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
