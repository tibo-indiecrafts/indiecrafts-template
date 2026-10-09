"use client";

/**
 * Captures a newsletter sign-up and posts it to /api/newsletter.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/NewsletterForm.md
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { NewsletterModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { FormFrame } from "./FormFrame";
import { FormInput, GuardedFields, SubmitButton } from "./GuardedFields";
import { useGuardedSubmit } from "./useGuardedSubmit";

/**
 * Newsletter capture form — the client half of `module.newsletter`, rendered by
 * the server `<Newsletter>` wrapper (which owns the feature gate). Every label is
 * a resolved, per-locale string from the block. Posts to `/api/newsletter`, which
 * emails a double opt-in link; the confirm click makes the person a Resend subscriber.
 * Every real sign-up answers `201` alike, so membership can't be enumerated.
 */
export function NewsletterForm({
  heading,
  body,
  emailPlaceholder,
  buttonLabel,
  consentText,
  successMessage,
  errorMessage,
  variant = "card",
  anchor,
}: NewsletterModule) {
  const t = useTranslations("forms");
  // Copy the editor left empty falls back to the page language (`forms.*` in the host
  // app's messages), never to another language's default.
  const text = {
    email: emailPlaceholder || t("emailPlaceholder"),
    button: buttonLabel || t("newsletter.button"),
    success: successMessage || t("newsletter.success"),
    error: errorMessage || t("error"),
    consent: consentText || t("newsletter.consent"),
  };
  const [email, setEmail] = useState("");
  const guard = useGuardedSubmit("/api/newsletter");
  const banner = variant === "banner";

  return (
    <FormFrame
      anchor={anchor}
      variant={variant}
      heading={heading}
      body={body}
      done={guard.status === "success"}
      success={text.success}
    >
      <GuardedFields
        guard={guard}
        onSubmit={() => guard.submit({ email })}
        consentText={text.consent}
        errorText={text.error}
        banner={banner}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <FormInput
            id={`${guard.uid}-email`}
            label={text.email}
            banner={banner}
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SubmitButton guard={guard} banner={banner} className="shrink-0">
            {text.button}
          </SubmitButton>
        </div>
      </GuardedFields>
    </FormFrame>
  );
}
