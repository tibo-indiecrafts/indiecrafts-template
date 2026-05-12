import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { loadBlockMessages } from "../src/i18n/block-messages";
import { STORY_MESSAGES } from "../src/i18n/story-messages";
import { loadPageMessages } from "../src/config/pages/messages";
import globalEn from "../messages/en.json";
import globalFr from "../messages/fr.json";
import "../src/app/globals.css";

/**
 * Per-story isolation:
 *   - `Pages/*` and `Layouts/*` stories compose many blocks (page-templates
 *     wrapping multiple section samples, layouts mounting default chrome
 *     + sidebar variants), so they always render with the FULL three-tier
 *     tree — same shape as `src/i18n/request.ts` produces in the app.
 *   - All other stories whose folder has its own `en.json` (sections,
 *     single-component molecules, isolated effects) render with ONLY
 *     that block's translations in scope, looked up by the story's title
 *     via the auto-generated `STORY_MESSAGES` map. Each story becomes a
 *     standalone preview that doesn't depend on any other component's
 *     translations.
 *   - Stories without their own `en.json` (ui-primitives, ui-effects
 *     without translations) also fall back to the full tree so any
 *     incidental block reference still resolves.
 *
 * Root chrome (`nav`, `cta`, `footer`, `common`, `typography`, `llms`,
 * etc.) is always loaded from `messages/<locale>.json` so layout chrome
 * still renders. The app's runtime path in `src/i18n/request.ts` is
 * unchanged — it continues to deep-merge the full three-tier tree.
 */
function buildMessages(
  locale: "en" | "fr",
  storyTitle: string | undefined,
): Record<string, unknown> {
  const root = locale === "fr" ? globalFr : globalEn;

  const composesMany =
    !!storyTitle &&
    (storyTitle.startsWith("Pages/") || storyTitle.startsWith("Layouts/"));
  if (composesMany) {
    return {
      ...root,
      pages: loadPageMessages(locale),
      blocks: loadBlockMessages(),
    };
  }

  const isolated = storyTitle ? STORY_MESSAGES[storyTitle] : undefined;
  if (isolated) {
    return { ...root, pages: {}, blocks: isolated };
  }

  return {
    ...root,
    pages: loadPageMessages(locale),
    blocks: loadBlockMessages(),
  };
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
    // Mount the App Router context so stories can use Link / usePathname /
    // useRouter from next/navigation (and our @/i18n/routing wrappers,
    // which delegate to next-intl/navigation → next/navigation). Without
    // this, components hit "invariant expected app router to be mounted".
    nextjs: { appDirectory: true },
    options: {
      storySort: {
        // Top-down from biggest abstraction to smallest. Buckets not listed
        // here fall through to alphabetical order, after the listed ones.
        order: [
          "Pages",
          [
            // One folder per page type — variants (Landing1, Landing2 …)
            // live inside, mirroring the codebase shape.
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
            // Marketing types (consumed by `Pages/Marketing/*`), then app + auth.
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
    // Theme switcher in the Storybook toolbar — toggles
    // `<html data-theme="dark|light">` to match the app's runtime behavior.
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
    // Locale provider — listens to the toolbar's `locale` global and
    // isolates per-story messages via `STORY_MESSAGES[ctx.title]`.
    (Story, ctx) => {
      const locale = (ctx.globals.locale as "en" | "fr") ?? "en";
      const fullscreen = ctx.parameters?.layout === "fullscreen";
      const wrapperClass = fullscreen
        ? "bg-background text-foreground flex min-h-svh flex-col"
        : "bg-background text-foreground flex min-h-svh flex-col p-6";
      return (
        <NextIntlClientProvider
          locale={locale}
          messages={buildMessages(locale, ctx.title)}
        >
          <div className={wrapperClass}>
            <Story />
          </div>
        </NextIntlClientProvider>
      );
    },
  ],
};

export default preview;
