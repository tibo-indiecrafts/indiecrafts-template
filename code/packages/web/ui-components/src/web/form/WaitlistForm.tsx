"use client";

/**
 * Captures a waitlist sign-up and posts it to /api/waitlist.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/WaitlistForm.md
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { WaitlistModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { FormFrame } from "./FormFrame";
import { FormInput, GuardedFields, SubmitButton } from "./GuardedFields";
import { useGuardedSubmit } from "./useGuardedSubmit";

/** Just the resolved copy — so the form is reusable both as a block and on a full page. */
export type WaitlistFormProps = Omit<
  WaitlistModule,
  "_type" | "_key" | "hidden" | "enabled"
> & {
  /** Heading element — `h3` inside a page's blocks; `h1` when the form IS the page. */
  headingAs?: "h1" | "h2" | "h3";
};

/**
 * Waitlist capture form — the client half of `module.waitlist`, rendered by the
 * server `<Waitlist>` wrapper (which owns the feature gate). Every label is a
 * resolved, per-locale string from the block. Posts to `/api/waitlist` → a
 * `waitlistEntry` doc. The name field only shows when `namePlaceholder` is set.
 * New or already-on answer `201` alike, so membership can't be enumerated.
 */
export function WaitlistForm({
  heading,
  body,
  emailPlaceholder,
  namePlaceholder,
  buttonLabel,
  consentText,
  successMessage,
  errorMessage,
  variant = "card",
  anchor,
  headingAs,
}: WaitlistFormProps) {
  const t = useTranslations("forms");
  // Copy the editor left empty falls back to the page language (`forms.*` in the host
  // app's messages), never to another language's default.
  const text = {
    // A page needs its h1: the form AS the page falls back to the page language's heading.
    heading:
      heading || (headingAs === "h1" ? t("waitlist.heading") : undefined),
    email: emailPlaceholder || t("emailPlaceholder"),
    button: buttonLabel || t("waitlist.button"),
    success: successMessage || t("waitlist.success"),
    error: errorMessage || t("error"),
    consent: consentText || t("waitlist.consent"),
  };
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const guard = useGuardedSubmit("/api/waitlist");
  const banner = variant === "banner";

  return (
    <FormFrame
      anchor={anchor}
      variant={variant}
      heading={text.heading}
      body={body}
      headingAs={headingAs}
      done={guard.status === "success"}
      success={text.success}
    >
      <GuardedFields
        guard={guard}
        onSubmit={() =>
          guard.submit({ email, ...(namePlaceholder ? { name } : {}) })
        }
        consentText={text.consent}
        errorText={text.error}
        banner={banner}
      >
        {namePlaceholder ? (
          <FormInput
            id={`${guard.uid}-name`}
            label={namePlaceholder}
            banner={banner}
            type="text"
            autoComplete="name"
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : null}
        <div className="flex flex-col gap-2 @md:flex-row">
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
