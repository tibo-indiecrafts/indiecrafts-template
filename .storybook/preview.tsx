import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import globalEn from "../messages/en.json";
import globalFr from "../messages/fr.json";
import "../src/app/globals.css";

/**
 * Storybook message tree.
 *
 * Stories see the production root tree (`messages/<locale>.json`) PLUS a
 * `blocks.<variant>` map built by globbing every `src/components/**\/en.json`
 * at preview-load time. The per-block samples (e.g. `blocks.features-01.title`)
 * stay valid so each component renders standalone with its own example copy.
 *
 * The production app does NOT load this `blocks.*` namespace — it reads from
 * `pages.<id>.blocks.<simpleName>.*` only (no variant suffix). See README →
 * "Migrating a section from /components into the app" for the wiring pattern.
 *
 * No codegen, no drift checks — adding a new block's `en.json` shows up here
 * automatically on the next Vite restart.
 */

type BlockJson = { default: Record<string, unknown> };

const blockEnModules = import.meta.glob<BlockJson>("../src/components/**/en.json", {
  eager: true,
});

function buildBlocks(): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [path, mod] of Object.entries(blockEnModules)) {
    // Flat file like "../src/components/ui-effects/3d-pin.en.json" → "3d-pin"
    const flat = path.match(/components\/[^/]+\/([^/]+)\.en\.json$/);
    if (flat) {
      result[flat[1]] = mod.default;
      continue;
    }
    // Folder file like ".../sections-features/features-01/en.json" → "features-01"
    const folder = path.match(/components\/.+\/([^/]+)\/en\.json$/);
    if (folder) {
      result[folder[1]] = mod.default;
    }
  }
  return result;
}

const blocks = buildBlocks();

function buildMessages(locale: "en" | "fr"): Record<string, unknown> {
  const root = locale === "fr" ? globalFr : globalEn;
  return { ...root, blocks };
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: "todo" },
    backgrounds: { disable: true }, // covered by data-theme
    nextjs: { appDirectory: true },
    options: {
      storySort: {
        order: [
          "Pages",
          [
            "Landing",
            "About",
            "Dashboard",
            "Login",
            "Signup",
            "ForgotPassword",
            "Error",
            "NotFound",
          ],
          "Sections",
          [
            "Cta",
            "Contact",
            "Content",
            "Faq",
            "Features",
            "Footer",
            "Pricing",
            "Stats",
            "Team",
            "Testimonials",
            "Charts",
            "Dashboard",
            "Data",
            "Settings",
            "Sidebar",
            "Auth",
          ],
          "Layouts",
          ["Default", "Dashboard", "FullBleed", "Prose", "Sidebar", "Shared"],
          "UI Molecules",
          "UI Effects",
          [
            "3D & Devices",
            "Backgrounds",
            "Buttons",
            "Cards",
            "Code",
            "Data display",
            "Globes & Maps",
            "Hover & Interactions",
            "Inputs",
            "Loaders & Progress",
            "Marquees & Scroll",
            "Modals & Overlays",
            "Nav",
            "Particles & Effects",
            "Social",
            "Text",
          ],
          "UI Primitives",
        ],
      },
    },
  },
  globalTypes: {
    locale: {
      name: "Locale",
      description: "Active locale for next-intl",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "fr", title: "Français" },
        ],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
    (Story, ctx) => {
      const locale = (ctx.globals.locale as "en" | "fr") ?? "en";
      const fullscreen = ctx.parameters?.layout === "fullscreen";
      const wrapperClass = fullscreen
        ? "bg-background text-foreground flex min-h-svh flex-col"
        : "bg-background text-foreground flex min-h-svh flex-col p-6";
      return (
        <NextIntlClientProvider locale={locale} messages={buildMessages(locale)}>
          <div className={wrapperClass}>
            <Story />
          </div>
        </NextIntlClientProvider>
      );
    },
  ],
};

export default preview;
