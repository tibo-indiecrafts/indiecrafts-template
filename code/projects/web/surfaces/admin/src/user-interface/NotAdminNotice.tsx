"use client";

/**
 * Offer a signed-in non-admin a way out of the admin sign-in route.
 *
 * @see docs/reference/projects/web/admin/src/user-interface/NotAdminNotice.md
 */
import { SignOutButton } from "@indiecrafts/packages-web-auth";
import { Button } from "@indiecrafts/packages-web-ui/web/button";

/**
 * Shown on the admin sign-in route when the visitor IS signed in but is not an
 * admin. Clerk's `<SignIn>` renders nothing for an already-signed-in user, so
 * without this a non-admin lands on a blank page with no way out. Sign-out returns
 * them to `/sign-in` (via the provider's after-sign-out URL), where the form shows.
 */
export function NotAdminNotice({
  message,
  signOutLabel,
}: {
  message: string;
  signOutLabel: string;
}) {
  return (
    <div className="mx-auto max-w-sm space-y-4 text-center">
      <p className="text-muted-foreground">{message}</p>
      <SignOutButton>
        <Button variant="outline">{signOutLabel}</Button>
      </SignOutButton>
    </div>
  );
}
