import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { loadBlockMessages } from "../src/i18n/block-messages";
import { loadPageMessages } from "../src/config/pages/messages";
import globalEn from "../messages/en.json";
import globalFr from "../messages/fr.json";
import "../src/app/globals.css";

/**
 * Three-tier merge mirroring `src/i18n/request.ts` so block samples + page
 * messages render in stories the same way they do in the app.
 */
function buildMessages(locale: "en" | "fr") {
  const root = locale === "fr" ? globalFr : globalEn;
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
    // Locale provider — listens to the toolbar's `locale` global.
    (Story, ctx) => {
      const locale = (ctx.globals.locale as "en" | "fr") ?? "en";
      const fullscreen = ctx.parameters?.layout === "fullscreen";
      // Mirror the live `<body>` shape from `[locale]/layout.tsx` so layouts
      // that own their chrome render with the same flex column flow — that
      // pins the footer to the bottom and lets `<main className="flex-1">`
      // grow into the empty space.
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
