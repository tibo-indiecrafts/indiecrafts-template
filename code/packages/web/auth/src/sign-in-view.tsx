/**
 * Render the token-themed sign-in surface.
 *
 * @see docs/reference/packages/web/auth/src/sign-in-view.md
 */
import { SignIn } from "@clerk/nextjs";
import { authAppearance } from "./appearance";

/**
 * The app's sign-in surface — Clerk's prebuilt `<SignIn>` themed from the design
 * tokens, with the post-sign-in fallback set to the app's home. Clerk honors a
 * `redirect_url` query param itself (validated against the instance origin), so a
 * user bounced from a protected page returns there; otherwise they land on `home`.
 * Mount it on a catch-all route (`/sign-in/[[...sign-in]]`).
 */
export function SignInView({ home = "/" }: { home?: string }) {
  return <SignIn appearance={authAppearance()} fallbackRedirectUrl={home} />;
}
