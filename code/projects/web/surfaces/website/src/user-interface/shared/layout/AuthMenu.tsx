"use client";

/**
 * Render the header sign-in button or account menu, only when Clerk is configured.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/AuthMenu.md
 */

import { useLocale, useTranslations } from "next-intl";
import { Show, SignInModalButton } from "@indiecrafts/packages-web-auth";
import { AccountControl } from "@/user-interface/account/AccountControl";

/**
 * Header auth affordance — a "Sign in" button (opens Clerk's modal, carrying the locale
 * into an in-modal sign-up) when signed out,
 * the account menu when signed in. Only mounts when Clerk is configured (else the
 * provider isn't present and Clerk's components would throw). Auth is opt-in, so with
 * no key the header looks exactly as before.
 */
export function AuthMenu() {
  const t = useTranslations("nav");
  const locale = useLocale();
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  return (
    <>
      <Show when="signed-out">
        <SignInModalButton locale={locale} label={t("signIn")} />
      </Show>
      <Show when="signed-in">
        <AccountControl variant="button" />
      </Show>
    </>
  );
}
