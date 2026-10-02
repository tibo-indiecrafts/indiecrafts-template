"use client";

/**
 * Renders the account-deletion form and drives the erasure submit.
 *
 * @see docs/reference/packages/shared/compliance/src/web/DeleteAccountSection.md
 */

import { useId, useState } from "react";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import { type DeleteAccountCopy } from "../shared/account-copy";
import { ChurnSurvey } from "./ChurnSurvey";
import {
  submitAccountErasure,
  type ChurnSurveyInput,
  type ErasureSelfResult,
} from "../shared/erasure-self";

export { submitAccountErasure } from "../shared/erasure-self";
export type {
  ChurnSurveyInput,
  ErasureSelfResult,
} from "../shared/erasure-self";

export interface DeleteAccountSectionProps {
  copy: DeleteAccountCopy;
  apiUrl: string;
  getToken: () => Promise<string | null>;
  onDeleted: () => void | Promise<void>;
  /**
   * Optional Clerk-aware submit. A surface injects a fn that wraps the raw
   * erasure fetch (+ the churn survey) in `useReverification` (client step-up
   * modal + auto-retry) and maps the outcome; the brick stays `@clerk/*`-free.
   * Omitted → the default `submitAccountErasure` path (no step-up).
   */
  submitErasure?: (
    email: string,
    survey?: ChurnSurveyInput,
  ) => Promise<ErasureSelfResult>;
}

type Status = "idle" | "pending" | ErasureSelfResult;

/**
 * The shared "Delete my account" section (web, shadcn) — Clerk/Next-free, so the
 * `app` web surface both use it. Takes `getToken` + `apiUrl`
 * as props and drives `submitAccountErasure`; copy is injected — no next-intl inside.
 */
export function DeleteAccountSection({
  copy,
  apiUrl,
  getToken,
  onDeleted,
  submitErasure,
}: DeleteAccountSectionProps) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "pending") return;
    setStatus("pending");
    // All three survey fields are optional — omit empties rather than sending "".
    const survey: ChurnSurveyInput = {
      ...(reason ? { reason } : {}),
      ...(feedback.trim() ? { feedback: feedback.trim() } : {}),
      ...(competitor.trim() ? { competitor: competitor.trim() } : {}),
    };
    // The section owns the safety net: a throwing injected submit (e.g. Clerk
    // reverification cancelled) resolves to "error" instead of hanging on
    // "pending". The default `submitAccountErasure` never throws.
    let result: ErasureSelfResult;
    try {
      result = submitErasure
        ? await submitErasure(email.trim(), survey)
        : await submitAccountErasure({
            apiUrl,
            getToken,
            email: email.trim(),
            ...survey,
          });
    } catch {
      result = "error";
    }
    setStatus(result);
    if (result === "done" || result === "partial") await onDeleted();
  }

  const statusText =
    status === "done"
      ? copy.success
      : status === "partial"
        ? copy.partial
        : status === "mismatch"
          ? copy.mismatch
          : status === "error"
            ? copy.error
            : null;

  return (
    // Folded by default: an irreversible action stays one deliberate click away. A native
    // <details> is keyboard- and screen-reader-ready (Enter/Space toggles, state announced).
    <details className={cn("group bg-card text-foreground rounded-xl border")}>
      <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-4 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        {copy.heading}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="px-4 pb-4">
        <p className="text-muted-foreground text-sm">{copy.body}</p>

        <form onSubmit={onSubmit} className="mt-3 space-y-4">
          <ChurnSurvey
            copy={copy.survey}
            idPrefix={uid}
            reason={reason}
            feedback={feedback}
            competitor={competitor}
            onReason={setReason}
            onFeedback={setFeedback}
            onCompetitor={setCompetitor}
          />

          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-email`}>{copy.emailLabel}</Label>
            <Input
              id={`${uid}-email`}
              type="email"
              placeholder={copy.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="destructive"
            disabled={status === "pending" || !email.trim()}
          >
            {status === "pending" ? copy.pending : copy.confirmButton}
          </Button>

          {statusText ? (
            <p role="status" className="text-muted-foreground text-sm">
              {statusText}
            </p>
          ) : null}
        </form>
      </div>
    </details>
  );
}
