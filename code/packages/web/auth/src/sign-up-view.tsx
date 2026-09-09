import { SignUp } from "@clerk/nextjs";
import { authAppearance } from "./appearance";

/**
 * The app's sign-up surface — Clerk's prebuilt `<SignUp>`, themed from the design
 * tokens and carrying the active `locale` in `unsafeMetadata`. The api's Clerk
 * webhook mirrors that to `user_profiles.locale`, so the user's transactional
 * auth emails (incl. the first verification code) render in their language. Mount
 * on a catch-all route (`/sign-up/[[...sign-up]]`) and point Clerk at it with
 * `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`.
 */
export function SignUpView({
  home = "/",
  locale,
}: {
  home?: string;
  locale?: string;
}) {
  return (
    <SignUp
      appearance={authAppearance()}
      fallbackRedirectUrl={home}
      unsafeMetadata={locale ? { locale } : undefined}
    />
  );
}
