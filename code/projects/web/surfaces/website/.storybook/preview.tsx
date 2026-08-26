import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "./preview.css";

/**
 * Global preview config for the website surface. The theme toolbar sets
 * `data-theme` on <html>, which is what the token system keys on
 * (`[data-theme="dark"]`), so one switch flips every color. Simpler than the
 * central preview — this surface has no react-native bricks to bridge.
 */
const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true, sort: "requiredFirst" },
    backgrounds: { disable: true }, // light/dark is driven by data-theme
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
