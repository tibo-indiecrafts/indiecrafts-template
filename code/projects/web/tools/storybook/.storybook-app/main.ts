import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

/**
 * Composition ref: the **app** surface's own Storybook. It runs with the
 * app app's `@/` alias (→ its `src/`), so surface components resolve their
 * app-internal imports for real — no cross-app `@/` collision with the main
 * (bricks) gallery. Composed into the main gallery via `refs` in `.storybook/main.ts`.
 * Stories are colocated in the app surface (its `src` tree, `.stories.tsx` files).
 */
const configDir = fileURLToPath(new URL(".", import.meta.url));
const appSrc = fileURLToPath(
  new URL("../../../surfaces/app/src", import.meta.url),
);
// configDir-relative glob (an absolute glob makes addon-vitest discover 0 tests).
const appStories = `${relative(configDir, appSrc)}/**/*.stories.@(ts|tsx)`;
const nextIntlMock = fileURLToPath(
  new URL("../.storybook/next-intl-mock.tsx", import.meta.url),
);
// Clerk needs a live SDK + publishable key; stub it so the auth components render.
// See `../.storybook/clerk-mock.tsx`.
const clerkMock = fileURLToPath(
  new URL("../.storybook/clerk-mock.tsx", import.meta.url),
);
// The app story files import `storybook/test` for their `play` fns, but
// `storybook` is a dep of the CENTRAL package only (pnpm strict), so it doesn't
// resolve from the app surface. Anchor a resolve from this file so vite
// finds it here — same trick as `.storybook/main.ts` (a raw require.resolve
// would pin the Node build and crash the browser bundle on `tty.isatty`).
const storybookAnchor = fileURLToPath(import.meta.url);

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs-vite", options: {} },
  stories: [appStories],
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

    // Auth is opt-in behind this key; mirrors the website's AuthMenu gate (no
    // app component currently gates on it directly, kept for parity + future use).
    // AnnouncementChrome reads NEXT_PUBLIC_API_URL eagerly at module scope — an
    // empty string keeps it falsy so `fetchAnnouncements` short-circuits before
    // ever calling `fetch`, so no story hits the network on render.
    cfg.define = {
      ...(cfg.define ?? {}),
      "process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": JSON.stringify("pk_test_storybook"),
      "process.env.NEXT_PUBLIC_API_URL": JSON.stringify(""),
    };

    cfg.resolve = cfg.resolve ?? {};
    const existing = Array.isArray(cfg.resolve.alias)
      ? cfg.resolve.alias
      : Object.entries(cfg.resolve.alias ?? {}).map(([find, replacement]) => ({
          find,
          replacement,
        }));
    cfg.resolve.alias = [
      // The app surface's `@/` → its own src. Scoped to THIS config, so no
      // collision with website/mobile (which mean a different root).
      { find: /^@\/(.*)$/, replacement: `${appSrc}/$1` },
      { find: /^next-intl$/, replacement: nextIntlMock },
      { find: /^next-intl\/server$/, replacement: nextIntlMock },
      { find: /^next-intl\/navigation$/, replacement: nextIntlMock },
      { find: /^@clerk\/nextjs$/, replacement: clerkMock },
      { find: /^@clerk\/nextjs\/server$/, replacement: clerkMock },
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
