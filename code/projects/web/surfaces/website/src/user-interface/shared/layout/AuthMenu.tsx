"use client";

import { useTranslations } from "next-intl";
import { Show, SignInButton } from "@indiecrafts/packages-web-auth";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { AccountControl } from "@/user-interface/account/AccountControl";

/**
 * Header auth affordance — a "Sign in" button (opens Clerk's modal) when signed out,
 * the account menu when signed in. Only mounts when Clerk is configured (else the
 * provider isn't present and Clerk's components would throw). Auth is opt-in, so with
 * no key the header looks exactly as before.
 */
export function AuthMenu() {
  const t = useTranslations("nav");
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm">
            {t("signIn")}
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <AccountControl variant="button" />
      </Show>
    </>
  );
}
