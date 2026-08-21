import { ClerkProvider } from "@clerk/nextjs";
import { authAppearance } from "./appearance";

/**
 * The app-themed Clerk provider. Wrap the root layout with it so `auth()` and the
 * hosted `<SignIn>` / `<SignUp>` components work app-wide, themed from the design
 * tokens (`authAppearance`). Reads `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from the
 * environment (the Clerk default). Server-component compatible — no `"use client"`.
 */
export function AppClerkProvider({ children }: { children: React.ReactNode }) {
  // Auth is opt-in. With no publishable key bound, the app runs exactly as before
  // — like Sanity / Turnstile / Resend here, inert until the operator configures it.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <>{children}</>;
  return <ClerkProvider appearance={authAppearance()}>{children}</ClerkProvider>;
}
