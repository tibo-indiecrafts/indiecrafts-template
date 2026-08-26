import { createRequire } from "node:module";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

/**
 * Composition ref: the **mobile** surface's (Expo/React Native) own Storybook. It runs
 * with the mobile app's `@/` alias (→ its own root, per its tsconfig `paths`) and
 * renders every RN component in the browser via the `react-native` → `react-native-web`
 * alias (same trick the main gallery uses for the `mobile-ui-native` brick's stories).
 * Composed into the main gallery via `refs` in `.storybook/main.ts`. Stories are
 * colocated in the mobile surface (`app/`, `components/`, `.stories.tsx` files).
 */
const require = createRequire(import.meta.url);
const configDir = fileURLToPath(new URL(".", import.meta.url));
const mobileRoot = fileURLToPath(
  new URL("../../../../mobile/surfaces/main", import.meta.url),
);
// configDir-relative glob (an absolute glob makes addon-vitest discover 0 tests).
// Scope to the mobile surface's OWN story dirs (`app/`, `components/`) — a bare
// `<root>/**` glob also matches `<root>/node_modules/**`, which drags in nested
// brick stories (kbd/progress/system-pages) that fail under the RN config.
const mobileBase = relative(configDir, mobileRoot);
const mobileStories = [
  `${mobileBase}/app/**/*.stories.@(ts|tsx)`,
  `${mobileBase}/components/**/*.stories.@(ts|tsx)`,
];
// The mobile story files import `storybook/test` for their `play` fns, but
// `storybook` is a dep of the CENTRAL package only (pnpm strict), so it doesn't
// resolve from the mobile surface. Anchor a resolve from this file so vite
// finds it here — same trick as `.storybook/main.ts` (a raw require.resolve
// would pin the Node build and crash the browser bundle on `tty.isatty`).
const storybookAnchor = fileURLToPath(import.meta.url);
// RN components import bare `react-native`; render them on the web via
// react-native-web. Resolve its dir from THIS package (it's a devDep here, not in
// the mobile surface's node_modules), so Vite picks the ESM `module` build for the browser.
const reactNativeWeb = dirname(require.resolve("react-native-web/package.json"));

// Expo/RN modules that reach for a native module at call time (no browser build) —
// stubbed under the central `.storybook/` dir. See each mock file's header comment.
const mock = (name: string) => fileURLToPath(new URL(`../.storybook/${name}`, import.meta.url));
const expoRouterMock = mock("expo-router-mock.tsx");
const clerkExpoMock = mock("clerk-expo-mock.tsx");
const secureStoreMock = mock("expo-secure-store-mock.ts");
const localizationMock = mock("expo-localization-mock.ts");
const webBrowserMock = mock("expo-web-browser-mock.ts");
const linkingMock = mock("expo-linking-mock.ts");
const netinfoMock = mock("netinfo-mock.ts");
const asyncStorageMock = mock("async-storage-mock.ts");

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs-vite", options: {} },
  stories: mobileStories,
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

    // Render React Native screens/components in the browser: map `react-native` to
    // `react-native-web`. Prebundle the shim so Vite never tries to parse the
    // real `react-native`'s Flow source.
    cfg.optimizeDeps = cfg.optimizeDeps ?? {};
    cfg.optimizeDeps.include = [...(cfg.optimizeDeps.include ?? []), "react-native-web"];

    // Auth is opt-in behind this key (mirrors the website/app pattern) — bind a demo
    // value so the sign-in screen's full Clerk-mock UI renders instead of NotConfigured.
    // API_URL/WEBSITE_URL are bound to "" (not left unset) so no story ever attempts a
    // real network call (announcements, geo, version-check, legal link-out all no-op).
    cfg.define = {
      ...(cfg.define ?? {}),
      "process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY": JSON.stringify("pk_test_storybook"),
      "process.env.EXPO_PUBLIC_API_URL": JSON.stringify(""),
      "process.env.EXPO_PUBLIC_WEBSITE_URL": JSON.stringify(""),
    };

    cfg.resolve = cfg.resolve ?? {};
    const existing = Array.isArray(cfg.resolve.alias)
      ? cfg.resolve.alias
      : Object.entries(cfg.resolve.alias ?? {}).map(([find, replacement]) => ({
          find,
          replacement,
        }));
    cfg.resolve.alias = [
      // The mobile surface's `@/` → its own root (its tsconfig maps `@/*` to `./*`,
      // not a `src/` subdir). Scoped to THIS config, so no collision with website/app.
      { find: /^@\/(.*)$/, replacement: `${mobileRoot}/$1` },
      { find: /^react-native$/, replacement: reactNativeWeb },
      { find: /^expo-router$/, replacement: expoRouterMock },
      { find: /^@clerk\/clerk-expo$/, replacement: clerkExpoMock },
      { find: /^expo-secure-store$/, replacement: secureStoreMock },
      { find: /^expo-localization$/, replacement: localizationMock },
      { find: /^expo-web-browser$/, replacement: webBrowserMock },
      { find: /^expo-linking$/, replacement: linkingMock },
      { find: /^@react-native-community\/netinfo$/, replacement: netinfoMock },
      {
        find: /^@react-native-async-storage\/async-storage$/,
        replacement: asyncStorageMock,
      },
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
