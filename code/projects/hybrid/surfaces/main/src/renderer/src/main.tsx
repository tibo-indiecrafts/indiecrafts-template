import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryDefaults } from "@indiecrafts/packages-shared-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { enUS, frFR } from "@clerk/localizations";
import { App } from "./App";
import {
  CLERK_PUBLISHABLE_KEY,
  hasClerk,
  authAppearance,
  HybridSessionLogger,
} from "./auth";
import { MarketingNudgeMount } from "./marketing-nudge";
import { detectLocale, messagesFor } from "./i18n";
import { sitePrefix } from "../../config";
import "./globals.css";

// Renderer entry — a real React mount (plain React 19 + Vite, NOT Next). Reuses the
// web bricks directly: shadcn `@indiecrafts/packages-web-ui` + the Next-agnostic
// `system-pages/web`. Detect the locale (navigator.language) → react-intl.
const locale = detectLocale();
document.documentElement.lang = locale; // index.html ships lang="en"; correct it at runtime.
document.title = sitePrefix; // authoritative window title from config; index.html ships a neutral placeholder.
// One QueryClient for the renderer's lifetime (shared defaults from the query brick).
// The renderer's `queryFn` is the preload bridge (`window.desktop.runAgent`) — the
// api-client call itself runs in the main process, so the token stays out of the DOM.
const queryClient = new QueryClient({ defaultOptions: queryDefaults });

const root = document.getElementById("app");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <IntlProvider
          locale={locale}
          messages={messagesFor(locale)}
          defaultLocale="en"
        >
          {hasClerk ? (
            <ClerkProvider
              publishableKey={CLERK_PUBLISHABLE_KEY}
              appearance={authAppearance}
              localization={locale === "fr" ? frFR : enUS}
            >
              <HybridSessionLogger />
              <MarketingNudgeMount />
              <App />
            </ClerkProvider>
          ) : (
            <App />
          )}
        </IntlProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
