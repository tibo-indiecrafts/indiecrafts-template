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
      ...existing,
    ];
    return cfg;
  },
};

export default config;
