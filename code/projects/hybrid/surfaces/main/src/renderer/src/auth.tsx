import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useSignIn,
  useAuth,
} from "@clerk/clerk-react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Checkbox } from "@indiecrafts/packages-web-ui/web/checkbox";
import { accountUrl } from "../../config";

/** Publishable key (PUBLIC) from the renderer env — auth is opt-in on its presence. */
export const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";
export const hasClerk = CLERK_PUBLISHABLE_KEY.length > 0;

/** Clerk `appearance` from the design tokens (CSS vars ui-tokens defines) — no
 *  hard-coded brand color. Inlined so the renderer never imports the Next-coupled
 *  `@indiecrafts/packages-web-auth`. */
export const authAppearance = {
  variables: {
    colorPrimary: "var(--primary)",
    colorBackground: "var(--background)",
    colorText: "var(--foreground)",
    colorDanger: "var(--destructive)",
    borderRadius: "var(--radius)",
  },
};

// `<SignIn>` handles email OTP natively; its SOCIAL buttons do a full-page redirect
// the Electron window blocks, so they are hidden and Google is the separate deep-link
// button below. ponytail: `<SignIn>`-in-Electron (virtual routing) + the hidden-social
// appearance need device verification; email OTP is the guaranteed desktop path.
const emailOnlyAppearance = {
  ...authAppearance,
  elements: {
    socialButtonsRoot: { display: "none" },
    socialButtons: { display: "none" },
    dividerRow: { display: "none" },
  },
};

/** The sign-in surface. Rendered only under `<ClerkProvider>` (mounted when
 *  `hasClerk`), so its Clerk hooks always have a provider. */
export function AuthPanel() {
  if (!hasClerk) return null;
  return (
    <ClerkLoaded>
      <SignedOut>
        <SignInPanel />
      </SignedOut>
      <SignedIn>
        <SignedInView />
      </SignedIn>
    </ClerkLoaded>
  );
}

function SignedInView() {
  const t = useIntl();
  const { signOut } = useAuth();
  // Account management (profile, security, export, delete) is the canonical WEB account —
  // "Manage account" opens `accountUrl` in the OS browser (the same link-out path as legal).
  // Sign-out + native cookie consent stay in the app. Disabled when no `accountUrl` is set.
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">
        {t.formatMessage({ id: "auth.signedIn" })}
      </p>
      <Button
        variant="outline"
        disabled={!accountUrl}
        onClick={() =>
          accountUrl && void window.desktop.openExternal(accountUrl)
        }
      >
        {t.formatMessage({ id: "account.manage" })}
      </Button>
      <Button variant="ghost" onClick={() => void signOut()}>
        {t.formatMessage({ id: "auth.signOut" })}
      </Button>
    </div>
  );
}

function SignInPanel() {
  const t = useIntl();
  // Kept un-destructured so Clerk's `isLoaded` discriminated union narrows the resource.
  const si = useSignIn();
  const pendingState = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [marketing, setMarketing] = useState(false);
  const fail = () => setError(t.formatMessage({ id: "auth.error" }));

  // Complete a Google deep-link when MAIN forwards the validated callback.
  useEffect(() => {
    const off = window.desktop.onOAuthCallback(async (data) => {
      // Re-validate the state against the value THIS renderer generated.
      if (!pendingState.current || data.state !== pendingState.current) return;
      pendingState.current = null;
      if (!si.isLoaded) return;
      try {
        const reloaded = await si.signIn.reload();
        if (reloaded.status === "complete" && reloaded.createdSessionId) {
          await si.setActive({ session: reloaded.createdSessionId });
        } else {
          fail();
        }
      } catch {
        fail();
      }
    });
    return off;
  }, [si]);

  const google = async () => {
    if (!si.isLoaded || busy) return;
    setBusy(true);
    setError(null);
    try {
      const state = crypto.randomUUID();
      pendingState.current = state;
      const res = await si.signIn.create({
        strategy: "oauth_google",
        redirectUrl: `indiecrafts://oauth-callback?state=${state}`,
      });
      const ext = res.firstFactorVerification?.externalVerificationRedirectURL;
      if (ext) await window.desktop.startOAuth(ext.toString());
      else fail();
    } catch {
      fail();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {mode === "signin" ? (
        <SignIn routing="virtual" appearance={emailOnlyAppearance} />
      ) : (
        // Carry the app locale + the marketing-email opt-in so the api webhook mirrors both
        // to user_profiles (locale localizes the auth emails; marketing_email records the
        // commercial-email consent). Clerk's prebuilt card can't host the checkbox, so it
        // sits beside it (unchecked by default).
        <div className="flex flex-col items-center gap-3">
          <SignUp
            routing="virtual"
            appearance={emailOnlyAppearance}
            unsafeMetadata={{ locale: t.locale, marketing_email: marketing }}
          />
          <label className="text-muted-foreground flex max-w-sm cursor-pointer items-start gap-2 text-sm">
            <Checkbox
              checked={marketing}
              onCheckedChange={(v) => setMarketing(v === true)}
              className="mt-0.5"
            />
            <span>{t.formatMessage({ id: "auth.marketingOptIn" })}</span>
          </label>
        </div>
      )}
      <Button variant="outline" disabled={busy} onClick={() => void google()}>
        {t.formatMessage({ id: "auth.google" })}
      </Button>
      <Button
        variant="ghost"
        onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
      >
        {t.formatMessage({
          id: mode === "signin" ? "auth.needAccount" : "auth.haveAccount",
        })}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

// Log each sign-in once (per session) to the EU D1 session store, via the MAIN process
// (the token stays out of the renderer). Deduped in-memory — sign-in is rare. Mount
// under <ClerkProvider>.
const loggedSessions = new Set<string>();
export function HybridSessionLogger() {
  const { isSignedIn, sessionId, userId } = useAuth();
  useEffect(() => {
    if (!isSignedIn || !sessionId || !userId || loggedSessions.has(sessionId))
      return;
    loggedSessions.add(sessionId);
    void window.desktop.logSignIn(userId, sessionId);
  }, [isSignedIn, sessionId, userId]);
  return null;
}
