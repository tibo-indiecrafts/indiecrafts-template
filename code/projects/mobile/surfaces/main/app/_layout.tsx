import type { ErrorBoundaryProps } from "expo-router";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { IntlProvider, useIntl } from "react-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryDefaults } from "@indiecrafts/packages-shared-query";
import { ThemePreferenceProvider } from "@/lib/theme-preference";
import { ErrorContent } from "@indiecrafts/packages-shared-system-pages/native";
import {
  detectLocale,
  getStoredLocale,
  setStoredLocale,
  messagesFor,
} from "@/lib/i18n";
import { ShellOverlays } from "@/components/ShellOverlays";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { enUS, frFR } from "@clerk/localizations";
import { CLERK_PUBLISHABLE_KEY, hasClerk, tokenCache } from "@/lib/auth";
import { logSignIn } from "@/lib/session-log";
import { defaultLocale, type Locale } from "@/config";

// Clerk's own UI localization per app locale. A locale with no Clerk pack degrades to
// English rather than silently mismatching — add a row when Clerk ships that language.
const CLERK_LOCALIZATION: Record<string, typeof enUS> = {
  en: enUS,
  fr: frFR,
};

// The provider tree — theme (persisted light/dark/system preference over the shared tokens) → i18n
// (a stored choice, else the device locale, hydrated async) → the router Stack, with
// the compliance/version overlays mounted on top. Locale switches at runtime (RN has no
// page reload) via `chooseLocale`, which re-renders `IntlProvider` with new messages.
// Log each sign-in once (per session) to the EU D1 session store. Deduped in-memory —
// sign-in is rare, so a Set for the app's lifetime is enough.
const loggedSessions = new Set<string>();
function SignInLogger() {
  const { isSignedIn, sessionId, userId } = useAuth();
  useEffect(() => {
    if (!isSignedIn || !sessionId || !userId || loggedSessions.has(sessionId))
      return;
    loggedSessions.add(sessionId);
    void logSignIn(userId, sessionId);
  }, [isSignedIn, sessionId, userId]);
  return null;
}

// Mirror an EXPLICIT locale choice to the signed-in user's Clerk `unsafeMetadata.locale`, so
// the api webhook updates `user_profiles.locale` and their emails follow their current
// language (not just the sign-up one). Syncs `choice` (a deliberate selection or the restored
// stored one), never the auto-detected device locale, so it can't clobber a real preference.
function LocaleSync({ choice }: { choice: Locale | null }) {
  const { isSignedIn, user } = useUser();
  useEffect(() => {
    if (!choice || !isSignedIn || !user) return;
    const current = (user.unsafeMetadata as { locale?: unknown } | undefined)
      ?.locale;
    if (current === choice) return;
    user
      .update({ unsafeMetadata: { ...user.unsafeMetadata, locale: choice } })
      .catch((error: unknown) => {
        // Best-effort: the UI already switched; emails keep the prior stored locale
        // until the next successful sync.
        console.warn("locale sync to Clerk failed", (error as Error)?.name);
      });
  }, [choice, isSignedIn, user]);
  return null;
}

function Providers({
  children,
  overlays = false,
}: {
  children: React.ReactNode;
  overlays?: boolean;
}) {
  const [device] = useState(detectLocale);
  // `null` = no stored choice yet (loading or none); a `Locale` once one is read.
  const [choice, setChoice] = useState<Locale | null>(null);
  useEffect(() => {
    void getStoredLocale().then(setChoice);
  }, []);
  const locale = choice ?? device;
  const chooseLocale = (l: Locale) => {
    setChoice(l);
    void setStoredLocale(l);
  };

  const tree = (
    <ThemePreferenceProvider>
      <IntlProvider
        locale={locale}
        messages={messagesFor(locale)}
        defaultLocale={defaultLocale}
      >
        {children}
        {overlays ? (
          <ShellOverlays
            locale={locale}
            chooseLocale={chooseLocale}
            hasChoice={choice !== null}
          />
        ) : null}
      </IntlProvider>
    </ThemePreferenceProvider>
  );

  // Auth is opt-in: mount Clerk only when the publishable key is set (else the app
  // runs exactly as before). The session is cached on the OS keychain (tokenCache).
  return hasClerk ? (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
      localization={CLERK_LOCALIZATION[locale] ?? enUS}
    >
      <SignInLogger />
      <LocaleSync choice={choice} />
      {tree}
    </ClerkProvider>
  ) : (
    tree
  );
}

/** Expo Router error boundary — the themed, translated 500 screen. The raw
 * `error.message` is logged for debugging, never shown (it is often a technical
 * string; DESIGN: never surface a raw error to the user). */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  console.error(error);
  return (
    <Providers>
      <ErrorScreen onRetry={() => void retry()} />
    </Providers>
  );
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  const t = useIntl();
  return (
    <ErrorContent
      title={t.formatMessage({ id: "error.title" })}
      description={t.formatMessage({ id: "error.description" })}
      retryLabel={t.formatMessage({ id: "error.retryLabel" })}
      onRetry={onRetry}
    />
  );
}

// One QueryClient for the app's lifetime (server-state cache; shared defaults from the
// query brick). A screen fetches with `useQuery`/`useMutation`, its `queryFn` calling
// the api-client. Created at module scope so it survives re-renders.
const queryClient = new QueryClient({ defaultOptions: queryDefaults });

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers overlays>
        <Stack screenOptions={{ headerShown: false }} />
      </Providers>
    </QueryClientProvider>
  );
}
