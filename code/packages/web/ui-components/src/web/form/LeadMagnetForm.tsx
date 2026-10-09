"use client";

/**
 * Captures an email for gated lead-magnet delivery via /api/newsletter.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/LeadMagnetForm.md
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { LeadMagnetModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { FormFrame } from "./FormFrame";
import { FormInput, GuardedFields, SubmitButton } from "./GuardedFields";
import { useGuardedSubmit } from "./useGuardedSubmit";

/**
 * Lead-magnet capture form — the client half of `module.lead-magnet`, rendered by
 * the server `<LeadMagnet>` wrapper (which owns the feature gate). Every label is
 * a resolved, per-locale string from the block. Posts to `/api/newsletter` with
 * `source: "lead-magnet"` + the magnet id as a tag, so gated delivery knows which
 * document to send. New or already-subscribed answer `201` alike, so membership
 * can't be enumerated.
 */
export function LeadMagnetForm({
  heading,
  body,
  emailPlaceholder,
  buttonLabel,
  consentText,
  successMessage,
  errorMessage,
  variant = "card",
  anchor,
  magnet,
}: LeadMagnetModule) {
  const t = useTranslations("forms");
  // Copy the editor left empty falls back to the page language (`forms.*` in the host
  // app's messages), never to another language's default.
  const text = {
    email: emailPlaceholder || t("emailPlaceholder"),
    button: buttonLabel || t("leadMagnet.button"),
    success: successMessage || t("leadMagnet.success"),
    error: errorMessage || t("error"),
    consent: consentText || t("leadMagnet.consent"),
  };
  const [email, setEmail] = useState("");
  // The confirm + magnet-delivery emails follow the visitor's language (the guard sends it).
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
        onSubmit={() =>
          guard.submit({
            email,
            source: "lead-magnet",
            tags: magnet?.id ? [magnet.id] : undefined,
          })
        }
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
