import { createRequire } from "node:module";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

// Resolve each design-system brick by its package NAME (not a relative path), so
// the story globs survive this package moving anywhere in the tree. `require.resolve`
// follows the pnpm workspace link to the brick's real dir — same trick as
// Storybook's own `getAbsolutePath`.
const require = createRequire(import.meta.url);
// Storybook `stories` entries are relative to the configDir (`.storybook/`). The
// `storybook build` normalizer also accepts an absolute glob, but the addon-vitest
// plugin does NOT — it mis-joins an absolute glob and discovers 0 tests. Emit a
// configDir-relative glob so BOTH the gallery and `test:stories` find stories.
const configDir = fileURLToPath(new URL(".", import.meta.url));
const brickStories = (pkg: string) =>
  `${relative(configDir, dirname(require.resolve(`${pkg}/package.json`)))}/src/**/*.stories.@(ts|tsx)`;

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
// Native bricks import bare `react-native`; render them on the web via
// react-native-web. Resolve its dir from THIS package (it's a devDep here, not in
// the bricks' node_modules), so Vite picks the ESM `module` build for the browser.
const reactNativeWeb = dirname(require.resolve("react-native-web/package.json"));

// Composition: each surface has its own Storybook (own `@/` alias), composed into
// this one gallery via `refs`. Opt-in (env-gated) so the default single gallery stays
// clean — set STORYBOOK_COMPOSE=1 and run the surface storybooks (e.g. `storybook:website`
// on :6007, `storybook:app` on :6008). Add a ref per surface as it lands; point at the
// deployed URL in production.
const refs = process.env.STORYBOOK_COMPOSE
  ? {
      "website-surface": { title: "Website (surface)", url: "http://localhost:6007" },
      "app-surface": { title: "App (surface)", url: "http://localhost:6008" },
      "mobile-surface": { title: "Mobile (surface)", url: "http://localhost:6009" },
    }
  : undefined;

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs-vite", options: {} },
  refs,
  // Colocated stories live in the design-system bricks (resolved by name); token
  // docs live here in `../stories`.
  stories: [
    "../stories/**/*.mdx",
    brickStories("@indiecrafts/packages-web-ui"),
    brickStories("@indiecrafts/packages-web-ui-components"),
    brickStories("@indiecrafts/packages-web-announcement"),
    brickStories("@indiecrafts/packages-web-locale-suggest"),
    // Native + cross-platform bricks — rendered in the browser via the
    // `react-native` → `react-native-web` alias below. The glob reaches both
    // `src/web/` and `src/native/` story files. Only globbed once a brick HAS
    // stories: the vitest storybook plugin bails to zero discovery on an empty glob.
    brickStories("@indiecrafts/packages-mobile-ui-native"),
    brickStories("@indiecrafts/packages-shared-system-pages"),
    brickStories("@indiecrafts/packages-shared-ui-icons"),
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

    // Render React Native bricks in the browser: map `react-native` to
    // `react-native-web`. Prebundle the shim so Vite never tries to parse the
    // real `react-native`'s Flow source.
    cfg.optimizeDeps = cfg.optimizeDeps ?? {};
    cfg.optimizeDeps.include = [...(cfg.optimizeDeps.include ?? []), "react-native-web"];

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
      // Native bricks import bare `react-native`; render it on the web via
      // react-native-web (absolute dir → Vite picks its ESM build). Exact match
      // so `react-native-web` itself is untouched.
      { find: /^react-native$/, replacement: reactNativeWeb },
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
