"use client";

import { useId, useState } from "react";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import { Textarea } from "@indiecrafts/packages-web-ui/web/textarea";
import {
  RadioGroup,
  RadioGroupItem,
} from "@indiecrafts/packages-web-ui/web/radio-group";
import {
  CHURN_REASON_CODES,
  type DeleteAccountCopy,
} from "../shared/account-copy";
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
    <div className={cn("bg-card text-foreground rounded-xl border p-4")}>
      <p className="text-sm font-semibold">{copy.heading}</p>
      <p className="text-muted-foreground mt-1 text-sm">{copy.body}</p>

      <form onSubmit={onSubmit} className="mt-3 space-y-4">
        <fieldset className="space-y-3">
          <legend className="text-foreground text-sm font-medium">
            {copy.survey.legend}
          </legend>

          <div className="space-y-1.5">
            <Label>{copy.survey.reasonLabel}</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {CHURN_REASON_CODES.map((code) => (
                <div key={code} className="flex items-center gap-2.5">
                  <RadioGroupItem id={`${uid}-reason-${code}`} value={code} />
                  <Label
                    htmlFor={`${uid}-reason-${code}`}
                    className="font-normal"
                  >
                    {copy.survey.reasons[code]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-feedback`}>
              {copy.survey.feedbackLabel}
            </Label>
            <Textarea
              id={`${uid}-feedback`}
              placeholder={copy.survey.feedbackPlaceholder}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-competitor`}>
              {copy.survey.competitorLabel}
            </Label>
            <Input
              id={`${uid}-competitor`}
              placeholder={copy.survey.competitorPlaceholder}
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
            />
          </div>
        </fieldset>

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
  );
}
