import type { ReactNode } from "react";

/**
 * Storybook stand-in for `@clerk/clerk-expo`. Clerk needs a live SDK + publishable key
 * to run; this stub renders the "signed in" branch by default (mirrors the web
 * `clerk-mock.tsx`'s default), so `SignedIn`/`useAuth` consumers render real UI without
 * a network round-trip. `useSignIn`/`useSignUp`/`useSSO` return resolved, harmless stubs
 * so the sign-in form's handlers don't throw when exercised in a story's `play` fn.
 */
export function useAuth() {
  return {
    isSignedIn: true,
    isLoaded: true,
    userId: "user_demo",
    sessionId: "sess_demo",
    getToken: async () => "mock-token",
    signOut: async () => {},
  };
}

export function useSignIn() {
  return {
    isLoaded: true,
    signIn: {
      create: async () => ({
        supportedFirstFactors: [
          { strategy: "email_code", emailAddressId: "idn_demo" },
        ],
      }),
      prepareFirstFactor: async () => ({}),
      attemptFirstFactor: async () => ({
        status: "complete",
        createdSessionId: "sess_demo",
      }),
    },
    setActive: async () => {},
  };
}

export function useSignUp() {
  return {
    isLoaded: true,
    signUp: {
      create: async () => ({}),
      prepareEmailAddressVerification: async () => ({}),
      attemptEmailAddressVerification: async () => ({
        status: "complete",
        createdSessionId: "sess_demo",
      }),
    },
    setActive: async () => {},
  };
}

export function useSSO() {
  return {
    startSSOFlow: async () => ({ createdSessionId: null, setActive: undefined }),
  };
}

export function SignedIn({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function SignedOut() {
  return null;
}

export function ClerkProvider({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export default { useAuth, useSignIn, useSignUp, useSSO, SignedIn, SignedOut, ClerkProvider };
