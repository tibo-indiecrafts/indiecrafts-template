"use client";

/**
 * Render the header's Clerk sign-in modal button or account menu.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/ClerkAuthMenu.md
 */

import { useLocale, useTranslations } from "next-intl";
import { Show, SignInModalButton } from "@indiecrafts/packages-web-auth";
import { AccountControl } from "@/user-interface/account/AccountControl";

/**
 * The header's auth control once Clerk is loaded: the account menu when signed in; a
 * "Sign in" button that opens Clerk's modal (carrying the locale into an in-modal sign-up)
 * when signed out — e.g. right after signing out. Loaded through `LazyClerkAuthMenu`.
 */
export function ClerkAuthMenu() {
  const t = useTranslations("nav");
  const locale = useLocale();
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
