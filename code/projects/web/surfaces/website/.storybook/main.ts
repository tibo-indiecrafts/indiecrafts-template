import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

// The website surface's OWN Storybook. Composed into the central gallery via its
// `refs` (points at http://localhost:6007). Mirrors the central `main.ts` but
// swaps the design-system-brick machinery (react-native-web, shiki, the
// `storybook/test` anchor) for what THIS surface needs: the `@/` path alias and
// the surface-local mocks (next-intl + Clerk).

// `@/` → this surface's `src` (mirrors tsconfig `paths`). Stories import
// `storybook/test` directly (storybook is a devDep here), so no anchor trick.
const websiteSrc = fileURLToPath(new URL("../src", import.meta.url));
// Renderers that read translations resolve to a static message map — no real
// i18n request/provider. See `.storybook/next-intl-mock.tsx`.
const nextIntlMock = fileURLToPath(new URL("./next-intl-mock.tsx", import.meta.url));
// Clerk needs a live SDK + publishable key; stub it so the auth components render.
// `@indiecrafts/packages-web-auth` re-exports from `@clerk/nextjs`, so this alias
// covers the barrel too. See `.storybook/clerk-mock.tsx`.
const clerkMock = fileURLToPath(new URL("./clerk-mock.tsx", import.meta.url));

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs-vite", options: {} },
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-a11y", // axe on every story
    "@storybook/addon-vitest", // run every story as a Vitest component test
  ],
  // Render async React Server Components if any story reaches one.
  features: { experimentalRSC: true },
  async viteFinal(cfg) {
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    cfg.plugins = cfg.plugins ?? [];
    cfg.plugins.push(tailwindcss());

    // Auth is opt-in behind this key; AuthMenu / AppClerkProvider render nothing
    // without it. Bind a demo value so the Clerk-mock path renders in stories.
    cfg.define = {
      ...(cfg.define ?? {}),
      "process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY":
        JSON.stringify("pk_test_storybook"),
    };

    cfg.resolve = cfg.resolve ?? {};
    const alias = cfg.resolve.alias;
    // Normalize to the array form + EXACT regex matches. An object alias for
    // "next-intl" is prefix-greedy and would rewrite "next-intl/server" too;
    // `/^next-intl$/` avoids that. The `@/` alias is a regex so it never eats
    // `@indiecrafts/...` (which has no slash right after `@`).
    const existing = Array.isArray(alias)
      ? alias
      : Object.entries(alias ?? {}).map(([find, replacement]) => ({ find, replacement }));
    cfg.resolve.alias = [
      { find: /^@\//, replacement: `${websiteSrc}/` },
      { find: /^next-intl$/, replacement: nextIntlMock },
      { find: /^next-intl\/server$/, replacement: nextIntlMock },
      { find: /^next-intl\/navigation$/, replacement: nextIntlMock },
      { find: /^@clerk\/nextjs$/, replacement: clerkMock },
      { find: /^@clerk\/nextjs\/server$/, replacement: clerkMock },
      ...existing,
    ];
    return cfg;
  },
};

export default config;
