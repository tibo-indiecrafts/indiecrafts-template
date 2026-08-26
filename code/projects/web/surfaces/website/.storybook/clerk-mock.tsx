/**
 * Storybook mock for `@clerk/nextjs` (+ `/server`). Aliased in main.ts so the
 * auth components render without a live Clerk SDK or publishable key. Covers the
 * `@indiecrafts/packages-web-auth` barrel too (it re-exports from `@clerk/nextjs`).
 *
 * The mock is "signed in" by default: `SignedIn` renders its children,
 * `SignedOut` renders nothing. Enough to prove the alias resolves and the auth
 * affordance mounts. A configurable signed-out variant is future work.
 */
import type { ReactNode } from "react";

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

/** Demo user. */
export function useUser() {
  return {
    isSignedIn: true,
    isLoaded: true,
    user: {
      id: "user_demo",
      fullName: "Demo User",
      primaryEmailAddress: { emailAddress: "demo@example.com" },
      imageUrl: "",
    },
  };
}

export function SignedIn({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SignedOut(_props: { children: ReactNode }) {
  return null;
}

/** Placeholder trigger — wraps its children (a Button) so the DOM matches. */
export function SignInButton({ children }: { children?: ReactNode; mode?: string }) {
  return <>{children}</>;
}

/** Placeholder account button. */
export function UserButton() {
  return (
    <button
      type="button"
      data-testid="mock-user-button"
      aria-label="Account"
      className="bg-muted size-8 rounded-full"
    />
  );
}

export function ClerkProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** Hosted views — inert placeholders (not reached by the proof stories). */
export function SignIn() {
  return <div data-testid="mock-sign-in" />;
}
export function SignUp() {
  return <div data-testid="mock-sign-up" />;
}

const clerkMock = {
  useAuth,
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  ClerkProvider,
  SignIn,
  SignUp,
};

export default clerkMock;
