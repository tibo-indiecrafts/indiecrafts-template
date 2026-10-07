"use client";

/**
 * Render the token-themed sign-up surface with a marketing opt-in.
 *
 * @see docs/reference/packages/web/auth/src/sign-up-view.md
 */

import { useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { Checkbox } from "@indiecrafts/packages-web-ui/web/checkbox";
import { authAppearance } from "./appearance";

/**
 * The app's sign-up surface — Clerk's prebuilt `<SignUp>`, themed from the design
 * tokens and carrying the active `locale` + the marketing-email opt-in in
 * `unsafeMetadata`. The api's Clerk webhook mirrors both to `user_profiles` (locale
 * localizes the auth emails; `marketing_email` records the commercial-email consent +
 * mirrors it to the Resend audience). Clerk's prebuilt card can't host a custom field,
 * so the (unchecked, GDPR-required) checkbox renders beside it and feeds the metadata
 * prop. Mount on a catch-all route (`/sign-up/[[...sign-up]]`) and point Clerk at it
 * with `AppClerkProvider signUpPath="/sign-up"`.
 */
export function SignUpView({
  home = "/",
  locale,
  marketingLabel,
}: {
  home?: string;
  locale?: string;
  /** The localized opt-in label. Omit → no checkbox (metadata carries no decision). */
  marketingLabel?: string;
}) {
  const [optIn, setOptIn] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <SignUp
        appearance={authAppearance()}
        fallbackRedirectUrl={home}
        unsafeMetadata={{
          ...(locale ? { locale } : {}),
          ...(marketingLabel ? { marketing_email: optIn } : {}),
        }}
      />
      {marketingLabel ? (
        <label className="text-muted-foreground flex max-w-sm cursor-pointer items-start gap-2 text-sm">
          <Checkbox
            checked={optIn}
            onCheckedChange={(v) => setOptIn(v === true)}
            className="mt-0.5"
          />
          <span>{marketingLabel}</span>
        </label>
      ) : null}
    </div>
  );
}
