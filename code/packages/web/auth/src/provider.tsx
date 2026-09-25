/**
 * Provide the app-themed, opt-in Clerk provider.
 *
 * @see docs/reference/packages/web/auth/src/provider.md
 */
import { ClerkProvider } from "@clerk/nextjs";
import { authAppearance } from "./appearance";
import { clerkLocalization } from "./localization";

/**
 * The app-themed Clerk provider. Wrap the layout with it so `auth()` and the
 * hosted `<SignIn>` / `<SignUp>` components work app-wide, themed from the design
 * tokens (`authAppearance`) and localized to the active `locale`. Reads
 * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from the environment (the Clerk default).
 * Server-component compatible — no `"use client"`. `nonce` (from the proxy's
 * per-request CSP nonce) is forwarded so ClerkJS's injected inline scripts carry
 * it under the strict nonce CSP. `locale` (the route's active locale) selects the
 * Clerk UI language bundle; omit it to keep Clerk's English default.
 */
export function AppClerkProvider({
  children,
  nonce,
  locale,
}: {
  children: React.ReactNode;
  nonce?: string;
  locale?: string;
}) {
  // Auth is opt-in. With no publishable key bound, the app runs exactly as before
  // — like Sanity / Turnstile / Resend here, inert until the operator configures it.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <>{children}</>;
  return (
    <ClerkProvider
      appearance={authAppearance()}
      nonce={nonce}
      localization={locale ? clerkLocalization(locale) : undefined}
    >
      {children}
    </ClerkProvider>
  );
}
