import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  SignIn,
  useSignIn,
  useAuth,
} from "@clerk/clerk-react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";

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
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-muted-foreground">
        {t.formatMessage({ id: "auth.signedIn" })}
      </p>
      <Button variant="outline" onClick={() => void signOut()}>
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
      <SignIn routing="virtual" appearance={emailOnlyAppearance} />
      <Button variant="outline" disabled={busy} onClick={() => void google()}>
        {t.formatMessage({ id: "auth.google" })}
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
    if (!isSignedIn || !sessionId || !userId || loggedSessions.has(sessionId)) return;
    loggedSessions.add(sessionId);
    void window.desktop.logSignIn(userId, sessionId);
  }, [isSignedIn, sessionId, userId]);
  return null;
}
