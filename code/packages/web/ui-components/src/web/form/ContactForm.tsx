"use client";

/**
 * Captures a contact message and posts it to /api/contact with anti-bot guards.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/ContactForm.md
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import { Textarea } from "@indiecrafts/packages-web-ui/web/textarea";
import type { ContactModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { FormFrame } from "./FormFrame";
import { FormInput, GuardedFields, SubmitButton } from "./GuardedFields";
import { useGuardedSubmit } from "./useGuardedSubmit";

/** Just the resolved copy — so the form is reusable both as a block and on a full page. */
export type ContactFormProps = Omit<
  ContactModule,
  "_type" | "_key" | "hidden" | "enabled"
> & {
  /** Heading element — `h3` inside a page's blocks; `h1` when the form IS the page. */
  headingAs?: "h1" | "h2" | "h3";
};

/**
 * Contact form — the client half of `module.contact`, rendered by the server
 * `<Contact>` wrapper (which owns the feature gate). Every label is a resolved,
 * per-locale string from the block. Posts to `/api/contact` → a `contactMessage`
 * doc. The name + subject fields only show when their placeholder is set; the
 * message textarea is always present (it is the point of the form).
 */
export function ContactForm({
  heading,
  body,
  emailPlaceholder,
  namePlaceholder,
  subjectPlaceholder,
  messagePlaceholder,
  buttonLabel,
  consentText,
  successMessage,
  errorMessage,
  variant = "card",
  anchor,
  headingAs,
}: ContactFormProps) {
  const t = useTranslations("forms");
  // Copy the editor left empty falls back to the page language (`forms.*` in the host
  // app's messages), never to another language's default.
  const text = {
    // A page needs its h1: the form AS the page falls back to the page language's heading.
    heading: heading || (headingAs === "h1" ? t("contact.heading") : undefined),
    email: emailPlaceholder || t("emailPlaceholder"),
    button: buttonLabel || t("contact.button"),
    success: successMessage || t("contact.success"),
    error: errorMessage || t("error"),
    consent: consentText || t("contact.consent"),
    message: messagePlaceholder || t("contact.messagePlaceholder"),
  };
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const guard = useGuardedSubmit("/api/contact");
  const banner = variant === "banner";
  const uid = guard.uid;

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
          guard.submit({
            email,
            message,
            ...(namePlaceholder ? { name } : {}),
            ...(subjectPlaceholder ? { subject } : {}),
          })
        }
        consentText={text.consent}
        errorText={text.error}
        banner={banner}
        className="text-left"
        footer={
          <SubmitButton guard={guard} banner={banner} className="w-full">
            {text.button}
          </SubmitButton>
        }
      >
        {namePlaceholder ? (
          <FormInput
            id={`${uid}-name`}
            label={namePlaceholder}
            banner={banner}
            type="text"
            autoComplete="name"
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : null}
        <FormInput
          id={`${uid}-email`}
          label={text.email}
          banner={banner}
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {subjectPlaceholder ? (
          <FormInput
            id={`${uid}-subject`}
            label={subjectPlaceholder}
            banner={banner}
            type="text"
            maxLength={200}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        ) : null}
        <Label htmlFor={`${uid}-message`} className="sr-only">
          {text.message}
        </Label>
        <Textarea
          id={`${uid}-message`}
          required
          rows={5}
          maxLength={5000}
          placeholder={text.message}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={
            banner
              ? "bg-background dark:bg-background text-foreground"
              : undefined
          }
        />
      </GuardedFields>
    </FormFrame>
  );
}
