import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { IntlProvider } from "react-intl";
// `react-native` resolves to `react-native-web` via the Vite alias in main.ts at
// build time; its types aren't installed in this tool, hence the suppression.
// @ts-expect-error - no react-native types here; aliased to react-native-web
import { Appearance } from "react-native";
import { ThemeProvider } from "@indiecrafts/packages-mobile-ui-native";
// @ts-expect-error - resolved via the `@/` alias in main.ts, not a real workspace path here
import { messagesFor } from "@/lib/i18n";
import "../.storybook/preview.css";

/**
 * Global preview config for the mobile surface. Screens read `useIntl()` (react-intl,
 * not next-intl), so every story needs a real `<IntlProvider>` above it — reuses the
 * app's own `messagesFor` (shell copy + this app's `messages/en.json`), same as the
 * real `_layout.tsx` provider tree. The theme toolbar bridges into the native
 * `<ThemeProvider>` (RN components read theme via context, not CSS custom properties).
 */
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
    (Story, context) => {
      const name =
        String(context.globals.theme).toLowerCase() === "dark" ? "dark" : "light";
      Appearance.setColorScheme?.(name);
      return (
        <ThemeProvider name={name}>
          <IntlProvider locale="en" messages={messagesFor("en")} defaultLocale="en">
            <Story />
          </IntlProvider>
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
