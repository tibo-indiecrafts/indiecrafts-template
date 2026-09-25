"use client";

/**
 * Renders the anonymous erasure-confirm form.
 *
 * @see docs/reference/projects/web/website/src/user-interface/erasure/ErasureConfirmForm.md
 */

import { useId, useState } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import { submitErasureConfirm } from "./submit";

/** All copy resolved server-side (from `messages.legal.erasure.confirm`). */
export type ErasureConfirmCopy = {
  heading: string;
  body: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitButton: string;
  pending: string;
  success: string;
  partial: string;
  mismatch: string;
  expired: string;
  error: string;
};

type Status = "idle" | "pending" | "done" | "partial" | "mismatch" | "expired" | "error";

/**
 * Anonymous branded erasure-confirm form — a signed-out visitor who opened the
 * emailed link types their email to confirm erasure. Posts JSON straight to
 * the public worker route `POST /v1/erasure/confirm` via the pure
 * `submitErasureConfirm` helper. `token` is opaque (from the URL) — it's sent
 * ONLY in the POST body, never rendered.
 */
export function ErasureConfirmForm({
  copy,
  token,
}: {
  copy: ErasureConfirmCopy;
  token: string;
}) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || status === "pending") return;
    setStatus("pending");
    const result = await submitErasureConfirm({
      apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
      token,
      email: email.trim(),
    });
    setStatus(result);
  }

  const statusText =
    status === "done"
      ? copy.success
      : status === "partial"
        ? copy.partial
        : status === "mismatch"
          ? copy.mismatch
          : status === "expired"
            ? copy.expired
            : status === "error"
              ? copy.error
              : null;

  return (
    <section
      aria-labelledby="erasure-confirm-heading"
      className="not-prose my-8 md:my-12"
    >
      <div className="bg-card mx-auto max-w-xl rounded-2xl border p-8 md:p-10">
        <h2
          id="erasure-confirm-heading"
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

          <Button
            type="submit"
            disabled={status === "pending" || !email.trim()}
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
