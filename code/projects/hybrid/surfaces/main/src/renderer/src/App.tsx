import { Component, useState, type ErrorInfo, type ReactNode } from "react";
import { useIntl } from "react-intl";
import { logger } from "@indiecrafts/packages-shared-logger";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import {
  ErrorContent,
  OfflineBanner,
} from "@indiecrafts/packages-shared-system-pages/web";
import { LegalLinks, ShareRow, ShellOverlays } from "./shell";
import { AuthPanel } from "./auth";
import { CookiePreferencesSection } from "./consent-preferences";

/** data-theme toggle. No value = OS `prefers-color-scheme` (tokens.css handles it). */
function useThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const toggle = () => {
    const current =
      theme ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
  };
  return toggle;
}

/** React error boundary → the shared, themed 500 screen (system-pages/web). */
class ErrorBoundary extends Component<
  { fallback: (reset: () => void) => ReactNode; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    // Never swallow — the boundary renders the 500 screen; the cause is logged
    // (structured, via the shared logger) for the renderer devtools / a future sink.
    logger.error("Renderer crashed", error, {
      componentStack: info.componentStack,
    });
  }
  render() {
    if (this.state.error)
      return this.props.fallback(() => this.setState({ error: null }));
    return this.props.children;
  }
}

function Home() {
  const t = useIntl();
  const toggleTheme = useThemeToggle();
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-semibold text-foreground">
        {t.formatMessage({ id: "app.title" })}
      </h1>
      <p className="text-muted-foreground">
        {t.formatMessage({ id: "app.subtitle" })}
      </p>
      <div className="flex gap-3">
        <Button>{t.formatMessage({ id: "app.primary" })}</Button>
        <Button variant="outline" onClick={toggleTheme}>
          {t.formatMessage({ id: "app.toggleTheme" })}
        </Button>
      </div>
      <AuthPanel />
      <ShareRow />
      <CookiePreferencesSection />
      <LegalLinks />
    </main>
  );
}

export function App() {
  const t = useIntl();
  return (
    <>
      <OfflineBanner message={t.formatMessage({ id: "offline.banner" })} />
      <ErrorBoundary
        fallback={(reset) => (
          <ErrorContent
            title={t.formatMessage({ id: "error.title" })}
            description={t.formatMessage({ id: "error.description" })}
            retryLabel={t.formatMessage({ id: "error.retryLabel" })}
            onRetry={reset}
          />
        )}
      >
        <Home />
        <ShellOverlays />
      </ErrorBoundary>
    </>
  );
}
