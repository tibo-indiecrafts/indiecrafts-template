import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "./preview.css";

/**
 * Global preview config. The theme toolbar sets `data-theme` on <html>, which
 * is exactly what the token system keys on (`[data-theme="dark"]`), so one
 * switch flips every color, the sidebar palette, shiki, and typeset.
 */
const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true, sort: "requiredFirst" },
    // We drive light/dark via data-theme, not the backgrounds addon.
    backgrounds: { disable: true },
    docs: { toc: true },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { Light: "light", Dark: "dark" },
      defaultTheme: "Light",
      attributeName: "data-theme",
    }),
    (Story) => (
      <div className="bg-background text-foreground min-w-64 p-8">
        <Story />
      </div>
    ),
  ],
};

export default preview;
