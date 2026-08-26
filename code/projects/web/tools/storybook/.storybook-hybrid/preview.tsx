import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { IntlProvider } from "react-intl";
import { messagesFor } from "../../../../hybrid/surfaces/main/src/renderer/src/i18n";
import "../.storybook/preview.css";

/**
 * Global preview config for the hybrid (Electron renderer) surface. Components read
 * `useIntl()` (react-intl, not next-intl), so every story needs a real `<IntlProvider>`
 * above it — reuses the renderer's own `messagesFor` (shared shell copy + this
 * renderer's `messages/en.json`), same as the real `main.tsx` provider tree.
 *
 * The renderer also reads `window.desktop` — the preload bridge Electron's main
 * process exposes via `contextBridge` (see `src/preload/index.ts` + `env.d.ts`). It
 * doesn't exist in a plain browser, so every story gets a harmless stub before render:
 * link-outs/OAuth/sign-in-logging just no-op instead of throwing.
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
    (Story) => {
      Object.assign(window, {
        desktop: {
          version: "storybook",
          runAgent: async () => ({}),
          openExternal: async () => {},
          startOAuth: async () => {},
          logSignIn: async () => {},
          onOAuthCallback: () => () => {},
        },
      });
      return (
        <IntlProvider locale="en" messages={messagesFor("en")} defaultLocale="en">
          <Story />
        </IntlProvider>
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
