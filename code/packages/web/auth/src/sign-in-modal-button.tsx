"use client";

/**
 * Open Clerk's sign-in modal, carrying the visitor's locale into an in-modal sign-up.
 *
 * @see docs/reference/packages/web/auth/src/sign-in-modal-button.md
 */
import { useClerk } from "@clerk/nextjs";
import { Button } from "@indiecrafts/packages-web-ui/web/button";

/**
 * Clerk's sign-in modal keeps its "Sign up" step inside the modal (it ignores
 * `signUpUrl`), and that sign-up sends no `unsafeMetadata` unless the opener passes it.
 * `<SignInButton>` can't, so this opens the modal itself with `{ locale }`: the api's
 * `user.created` webhook stores it, and the welcome and auth emails go out in the
 * visitor's language. The modal has no marketing checkbox; the `/sign-up` page has.
 */
export function SignInModalButton({
  locale,
  label,
}: {
  locale: string;
  label: string;
}) {
  const clerk = useClerk();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => clerk.openSignIn({ unsafeMetadata: { locale } })}
    >
      {label}
    </Button>
  );
}
