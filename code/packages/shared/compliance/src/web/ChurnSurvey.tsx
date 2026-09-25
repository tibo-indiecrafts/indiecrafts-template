"use client";

/**
 * Renders the optional churn exit-survey fields for account deletion.
 *
 * @see docs/reference/packages/shared/compliance/src/web/ChurnSurvey.md
 */

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

/** The churn exit-survey copy — the `survey` slice of `DeleteAccountCopy`. */
export type ChurnSurveyCopy = DeleteAccountCopy["survey"];

export interface ChurnSurveyProps {
  copy: ChurnSurveyCopy;
  /** Prefix for the field ids (the parent's `useId`), so labels bind uniquely. */
  idPrefix: string;
  reason: string;
  feedback: string;
  competitor: string;
  onReason: (value: string) => void;
  onFeedback: (value: string) => void;
  onCompetitor: (value: string) => void;
}

/**
 * The optional "before you go" exit-survey — reason (radio) + free-text feedback + who
 * they're switching to. A controlled sub-component of `DeleteAccountSection`: it owns no
 * state, and copy is injected (no next-intl). Extracted so the deletion form stays focused
 * on the confirm + submit path.
 */
export function ChurnSurvey({
  copy,
  idPrefix: uid,
  reason,
  feedback,
  competitor,
  onReason,
  onFeedback,
  onCompetitor,
}: ChurnSurveyProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-foreground text-sm font-medium">
        {copy.legend}
      </legend>

      <div className="space-y-1.5">
        <Label>{copy.reasonLabel}</Label>
        <RadioGroup value={reason} onValueChange={onReason}>
          {CHURN_REASON_CODES.map((code) => (
            <div key={code} className="flex items-center gap-2.5">
              <RadioGroupItem id={`${uid}-reason-${code}`} value={code} />
              <Label htmlFor={`${uid}-reason-${code}`} className="font-normal">
                {copy.reasons[code]}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-feedback`}>{copy.feedbackLabel}</Label>
        <Textarea
          id={`${uid}-feedback`}
          placeholder={copy.feedbackPlaceholder}
          value={feedback}
          onChange={(e) => onFeedback(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-competitor`}>{copy.competitorLabel}</Label>
        <Input
          id={`${uid}-competitor`}
          placeholder={copy.competitorPlaceholder}
          value={competitor}
          onChange={(e) => onCompetitor(e.target.value)}
        />
      </div>
    </fieldset>
  );
}
