/**
 * Configure the gallery Storybook preview: a theme toolbar keyed on data-theme.
 *
 * @see docs/reference/projects/web/tools/storybook/.storybook/preview.md
 */
import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { LOCALES, setLocale } from "./next-intl-mock";
import "./preview.css";

/**
 * Global preview config. The theme toolbar sets `data-theme` on <html>, which
 * is exactly what the token system keys on (`[data-theme="dark"]`), so one
 * switch flips every color, the sidebar palette, shiki, and typeset.
 */
const preview: Preview = {
  // Locale toolbar — translated renderers read the website's real messages/<locale>.json.
  globalTypes: {
    locale: {
      description: "Locale for translated components",
      toolbar: { title: "Locale", icon: "globe", items: LOCALES, dynamicTitle: true },
    },
  },
  initialGlobals: { locale: "en" },
  parameters: {
    // Full-width by default — a gallery reads better wide, and the tiny centered
    // previews were the complaint. A story can still opt into `centered`/`padded`.
    layout: "fullscreen",
    controls: { expanded: true, sort: "requiredFirst" },
    // We drive light/dark via data-theme, not the backgrounds addon.
    backgrounds: { disable: true },
    // axe violations FAIL the story test (the addon default, "todo", only warns).
    a11y: { test: "error" },
    docs: { toc: true },
    // Sidebar IA: docs + tokens first, then domain components, UI atoms last.
    options: {
      storySort: {
        order: [
          "Introduction",
          "Design Tokens",
          ["Colors", "Typography & Radius", "Sidebar & Charts"],
          "Adaptive & container queries",
          "UI Components",
          "Chrome",
          "Compliance",
          "System Pages",
          "Icons",
          "UI",
          "*",
        ],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { Light: "light", Dark: "dark" },
      defaultTheme: "Light",
      attributeName: "data-theme",
    }),
    (Story, { globals }) => {
      setLocale(globals.locale);
      document.documentElement.lang = globals.locale;
      return (
        <div className="bg-background text-foreground min-w-64 p-8">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
