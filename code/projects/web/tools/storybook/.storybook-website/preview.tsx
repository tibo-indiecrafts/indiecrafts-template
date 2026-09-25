/**
 * Configure the website-surface Storybook preview with a theme toolbar and token wrapper.
 *
 * @see docs/reference/projects/web/tools/storybook/.storybook-website/preview.md
 */
import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "../.storybook/preview.css";

/** Lean preview for the website surface: theme toolbar (data-theme) + token wrapper. */
const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true, sort: "requiredFirst" },
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
