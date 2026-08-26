import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

/**
 * Composition ref: the **hybrid** (Electron) surface's own Storybook. It renders the
 * renderer process's React tree (plain React 19 + Vite, NOT Next — reuses the web
 * bricks directly) in a plain browser, same as the `app` surface. Composed into the
 * main gallery via `refs` in `.storybook/main.ts`. Stories are colocated in the
 * hybrid renderer (`src/renderer/src/`, `.stories.tsx` files).
 */
const configDir = fileURLToPath(new URL(".", import.meta.url));
const rendererSrc = fileURLToPath(
  new URL("../../../../hybrid/surfaces/main/src/renderer/src", import.meta.url),
);
// configDir-relative glob (an absolute glob makes addon-vitest discover 0 tests).
// Scoped to the renderer's OWN src dir — no sibling `node_modules` under it, so a
// single glob is safe (the bug that bit mobile needed a split glob because its
// story roots sit next to the surface's own `node_modules`).
const hybridStories = `${relative(configDir, rendererSrc)}/**/*.stories.@(ts|tsx)`;
// The hybrid story files import `storybook/test` for their `play` fns, but
// `storybook` is a dep of the CENTRAL package only (pnpm strict), so it doesn't
// resolve from the hybrid surface. Anchor a resolve from this file so vite
// finds it here — same trick as `.storybook/main.ts` (a raw require.resolve
// would pin the Node build and crash the browser bundle on `tty.isatty`).
const storybookAnchor = fileURLToPath(import.meta.url);
// The renderer's Clerk SDK is `@clerk/clerk-react` (not `@clerk/nextjs`/`@clerk/clerk-expo`
// — its own mock). See `../.storybook/clerk-react-mock.tsx`.
const clerkReactMock = fileURLToPath(
  new URL("../.storybook/clerk-react-mock.tsx", import.meta.url),
);

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs-vite", options: {} },
  stories: [hybridStories],
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

    // Auth is opt-in behind this key; bind a demo value so the Clerk-mock path
    // renders. API_URL/WEBSITE_URL are bound to "" (not left unset) so no story ever
    // attempts a real network call (announcements, geo, version-check, legal
    // link-out all no-op) — mirrors the app/mobile surfaces' pattern.
    cfg.define = {
      ...(cfg.define ?? {}),
      "import.meta.env.VITE_CLERK_PUBLISHABLE_KEY": JSON.stringify("pk_test_storybook"),
      "import.meta.env.VITE_API_URL": JSON.stringify(""),
      "import.meta.env.VITE_WEBSITE_URL": JSON.stringify(""),
      "import.meta.env.VITE_BUILD_ID": JSON.stringify("storybook"),
      "import.meta.env.VITE_SITE_PREFIX": JSON.stringify("storybook"),
    };

    cfg.resolve = cfg.resolve ?? {};
    const existing = Array.isArray(cfg.resolve.alias)
      ? cfg.resolve.alias
      : Object.entries(cfg.resolve.alias ?? {}).map(([find, replacement]) => ({
          find,
          replacement,
        }));
    cfg.resolve.alias = [
      { find: /^@clerk\/clerk-react$/, replacement: clerkReactMock },
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
