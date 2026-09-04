"use client";

import { useId, useState } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import {
  TurnstileWidget,
  turnstileActive,
} from "@indiecrafts/packages-web-ui-components/web/form/TurnstileWidget";
import { submitErasureRequest } from "./submit";

/** All copy resolved server-side (from `messages.legal.erasure.request`). */
export type ErasureRequestCopy = {
  heading: string;
  body: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitButton: string;
  pending: string;
  sent: string;
  turnstile: string;
  error: string;
};

type Status = "idle" | "pending" | "sent" | "turnstile" | "error";

/**
 * Anonymous branded erasure-request form — a signed-out visitor submits their
 * email (+ a Turnstile challenge) to start data erasure. Posts form-encoded
 * data straight to the public worker route `POST /v1/erasure/request` via
 * the pure `submitErasureRequest` helper — no same-app API route in between.
 * "sent" always shows the same generic anti-enumeration message, whether or
 * not the email matched a subject.
 */
export function ErasureRequestForm({ copy }: { copy: ErasureRequestCopy }) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [tsToken, setTsToken] = useState<string | null>(null);
  const [tsKey, setTsKey] = useState(0); // bump to remount Turnstile after a failed submit

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || status === "pending") return;
    setStatus("pending");
    const result = await submitErasureRequest({
      apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
      email: email.trim(),
      turnstileToken: tsToken,
    });
    setStatus(result);
    if (result === "turnstile") {
      setTsToken(null);
      setTsKey((k) => k + 1);
    }
  }

  const statusText =
    status === "sent"
      ? copy.sent
      : status === "turnstile"
        ? copy.turnstile
        : status === "error"
          ? copy.error
          : null;

  return (
    <section
      aria-labelledby="erasure-request-heading"
      className="not-prose my-8 md:my-12"
    >
      <div className="bg-card mx-auto max-w-xl rounded-2xl border p-8 md:p-10">
        <h2
          id="erasure-request-heading"
          className="text-foreground font-sans text-xl font-semibold text-balance md:text-2xl"
        >
          {copy.heading}
        </h2>
        <p className="text-muted-foreground mt-2 text-pretty">{copy.body}</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-email`}>{copy.emailLabel}</Label>
            <Input
              id={`${uid}-email`}
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder={copy.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <TurnstileWidget key={tsKey} onToken={setTsToken} />

          <Button
            type="submit"
            disabled={
              status === "pending" || !email.trim() || (turnstileActive() && !tsToken)
            }
            className="w-full sm:w-auto"
          >
            {status === "pending" ? copy.pending : copy.submitButton}
          </Button>

          {statusText ? (
            <p role="status" className="text-muted-foreground text-sm">
              {statusText}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
