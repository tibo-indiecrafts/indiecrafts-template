import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
// `react-native` resolves to `react-native-web` via the Vite alias in main.ts at
// build time; its types aren't installed in this tool, hence the suppression.
// @ts-expect-error - no react-native types here; aliased to react-native-web
import { Appearance } from "react-native";
import { ThemeProvider } from "@indiecrafts/packages-mobile-ui-native/theme";
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
    // Bridge the theme toolbar to the native design system. Two native theming
    // paths exist, so cover both: the `ui-native` brick reads its `<ThemeProvider>`,
    // while `system-pages/native` reads `useColorScheme()` directly — so also push
    // the scheme into react-native-web's `Appearance`. A no-op for web stories.
    (Story, context) => {
      const name =
        String(context.globals.theme).toLowerCase() === "dark" ? "dark" : "light";
      Appearance.setColorScheme?.(name);
      return (
        <ThemeProvider name={name}>
          <Story />
        </ThemeProvider>
      );
    },
    (Story) => (
      <div className="bg-background text-foreground min-w-64 p-8">
        <Story />
      </div>
    ),
  ],
};

export default preview;
