/**
 * Provide the app-themed, opt-in Clerk provider.
 *
 * @see docs/reference/packages/web/auth/src/provider.md
 */
import { ClerkProvider } from "@clerk/nextjs";
import {
  localizedPathname,
  type Locale,
} from "@indiecrafts/packages-shared-config";
import { authAppearance } from "./appearance";
import { clerkLocalization } from "./localization";
import { ClerkActive } from "./clerk-active";

/**
 * The app-themed Clerk provider. Wrap the layout with it so `auth()` and the
 * hosted `<SignIn>` / `<SignUp>` components work app-wide, themed from the design
 * tokens (`authAppearance`) and localized to the active `locale`. Reads
 * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from the environment (the Clerk default).
 * Server-component compatible — no `"use client"`. `nonce` (from the proxy's
 * per-request CSP nonce) is forwarded so ClerkJS's injected inline scripts carry
 * it under the strict nonce CSP. `locale` (the route's active locale) selects the
 * Clerk UI language bundle; omit it to keep Clerk's English default.
 *
 * `signUpPath` (e.g. `"/sign-up"`) sends every Clerk "Sign up" link — the sign-in
 * modal's included — to the app's own page in the active locale. Without it the
 * modal signs up in place, with no `unsafeMetadata`: no locale (the welcome email
 * falls back to English) and no marketing decision. A surface with no sign-up page
 * (admin) omits it.
 *
 * Its subtree reads `useClerkActive()` as true. The website loads this provider only when
 * needed, through `next/dynamic` from a client module (there `ClerkProvider` resolves to
 * Clerk's client provider), so it has no `"use client"` of its own.
 */
export function AppClerkProvider({
  children,
  nonce,
  locale,
  signUpPath,
}: {
  children: React.ReactNode;
  nonce?: string;
  locale?: string;
  signUpPath?: `/${string}`;
}) {
  // Auth is opt-in. With no publishable key bound, the app runs exactly as before
  // — like Sanity / Turnstile / Resend here, inert until the operator configures it.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <>{children}</>;
  return (
    <ClerkProvider
      appearance={authAppearance()}
      nonce={nonce}
      localization={locale ? clerkLocalization(locale) : undefined}
      signUpUrl={
        signUpPath && locale
          ? localizedPathname(signUpPath, locale as Locale)
          : signUpPath
      }
    >
      <ClerkActive>{children}</ClerkActive>
    </ClerkProvider>
  );
}
