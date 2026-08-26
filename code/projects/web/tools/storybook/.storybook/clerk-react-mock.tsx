import type { ReactNode } from "react";

/**
 * Storybook mock for `@clerk/clerk-react` (the hybrid/Electron renderer's Clerk SDK —
 * distinct from `@clerk/nextjs` (web) and `@clerk/clerk-expo` (mobile), so it gets its
 * own mock). Aliased in `.storybook-hybrid/main.ts` so the auth components render
 * without a live Clerk SDK or publishable key.
 *
 * The mock is "signed in" by default: `SignedIn` renders its children, `SignedOut`
 * renders nothing — same bias as the web + Expo mocks, so `AuthPanel`'s signed-in
 * branch (`SignedInView`) is what stories exercise.
 */

/** Signed-in demo session. */
export function useAuth() {
  return {
    isSignedIn: true,
    isLoaded: true,
    userId: "user_demo",
    sessionId: "sess_demo",
    getToken: async () => "demo-token",
    signOut: async () => {},
  };
}

/** Resolved, harmless stub — `SignInPanel`'s Google button reads `si.signIn.create`
 *  only inside its click handler, never at render time. */
export function useSignIn() {
  return {
    isLoaded: true,
    signIn: {
      create: async () => ({ firstFactorVerification: undefined }),
      reload: async () => ({ status: "complete", createdSessionId: "sess_demo" }),
    },
    setActive: async () => {},
  };
}

export function ClerkLoaded({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SignedIn({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SignedOut(_props: { children: ReactNode }) {
  return null;
}

/** Hosted sign-in view — inert placeholder (not reached by the proof stories). */
export function SignIn() {
  return <div data-testid="mock-sign-in" />;
}

export function ClerkProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const clerkReactMock = {
  useAuth,
  useSignIn,
  ClerkLoaded,
  SignedIn,
  SignedOut,
  SignIn,
  ClerkProvider,
};

export default clerkReactMock;
