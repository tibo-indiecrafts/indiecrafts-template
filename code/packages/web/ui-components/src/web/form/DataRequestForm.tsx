"use client";

/**
 * Captures a GDPR data-subject request and posts it to /api/data-request.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/DataRequestForm.md
 */

import { useId, useState } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Textarea } from "@indiecrafts/packages-web-ui/web/textarea";
import { Checkbox } from "@indiecrafts/packages-web-ui/web/checkbox";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@indiecrafts/packages-web-ui/web/radio-group";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { TurnstileWidget, turnstileActive } from "./TurnstileWidget";

/** One selectable right — `value` is a compliance request-type key, `label` is localized. */
export type DataRequestOption = { value: string; label: string };

/** All copy resolved server-side (from `messages`) and handed to the client form. */
export type DataRequestCopy = {
  heading?: string;
  body?: string;
  legend: string;
  options: DataRequestOption[];
  emailLabel: string;
  emailPlaceholder?: string;
  messageLabel: string;
  messagePlaceholder?: string;
  consentText: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  /** Active locale — stamped on the stored record. */
  locale?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * GDPR data-subject request form — a visitor picks a right, gives their email and
 * an optional message, and submits. Posts to `/api/data-request`, which stores the
 * request in the api's `data_requests` table (D1) and alerts the controller. The
 * heading is the page's `<h1>`: this form is the whole `/data-request` page.
 * Mirrors `NewsletterForm`: a hidden honeypot + a render timestamp block bots;
 * Turnstile gates submit when a site key is set. All copy is passed in — the
 * component imports no app messages.
 */
export function DataRequestForm({
  heading,
  body,
  legend,
  options,
  emailLabel,
  emailPlaceholder,
  messageLabel,
  messagePlaceholder,
  consentText,
  submitLabel,
  successMessage,
  errorMessage,
  locale,
}: DataRequestCopy) {
  const [requestType, setRequestType] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [tsToken, setTsToken] = useState<string | null>(null);
  const [tsKey, setTsKey] = useState(0); // bump to reset Turnstile after a failed submit
  const [startedAt] = useState(() => Date.now()); // anti-bot: reject near-instant submits server-side
  const uid = useId();

  function fail() {
    setStatus("error");
    setTsToken(null);
    setTsKey((k) => k + 1);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/data-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          requestType,
          consent,
          message: message || undefined,
          language: locale,
          source: window.location.pathname,
          honeypot: website,
          startedAt,
          ...(tsToken ? { "cf-turnstile-response": tsToken } : {}),
        }),
      });
      if (res.status === 201) setStatus("success");
      else fail();
    } catch {
      fail();
    }
  }

  if (status === "success") {
    return (
      <section className="not-prose @container my-8 md:my-12">
        <p
          role="status"
          aria-live="polite"
          className="bg-muted text-muted-foreground mx-auto max-w-xl rounded-lg px-4 py-3 text-center text-sm"
        >
          {successMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="not-prose @container my-8 md:my-12">
      <div className="bg-card mx-auto max-w-xl rounded-2xl border p-8 md:p-10">
        {heading ? (
          <h1 className="text-foreground font-sans text-xl font-semibold text-balance md:text-2xl">
            {heading}
          </h1>
        ) : null}
        {body ? (
          <p className="text-muted-foreground mt-2 text-pretty">{body}</p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          {/* Honeypot — off-screen, hidden from users + assistive tech. */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
          >
            <label>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-foreground text-sm font-medium">
              {legend}
            </legend>
            <RadioGroup
              value={requestType}
              onValueChange={setRequestType}
              required
            >
              {options.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2.5">
                  <RadioGroupItem
                    id={`${uid}-${opt.value}`}
                    value={opt.value}
                  />
                  <Label
                    htmlFor={`${uid}-${opt.value}`}
                    className="font-normal"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>

          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-email`}>{emailLabel}</Label>
            <Input
              id={`${uid}-email`}
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-message`}>{messageLabel}</Label>
            <Textarea
              id={`${uid}-message`}
              maxLength={4000}
              placeholder={messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex items-start gap-2.5">
            <Checkbox
              id={`${uid}-consent`}
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
            />
            <Label
              htmlFor={`${uid}-consent`}
              className="text-muted-foreground text-xs leading-snug font-normal"
            >
              {consentText}
            </Label>
          </div>

          <TurnstileWidget key={tsKey} onToken={setTsToken} />

          <Button
            type="submit"
            disabled={
              status === "submitting" ||
              !requestType ||
              !consent ||
              (turnstileActive() && !tsToken)
            }
            className="w-full sm:w-auto"
          >
            {submitLabel}
          </Button>

          {status === "error" ? (
            <p
              role="alert"
              aria-live="assertive"
              className="text-destructive text-sm"
            >
              {errorMessage}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
