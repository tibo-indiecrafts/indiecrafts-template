"use client";

/**
 * Prompts review and re-acceptance of changed legal documents.
 *
 * @see docs/reference/packages/shared/compliance/src/web/LegalReacceptancePrompt.md
 */

import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import type { LegalReacceptanceCopy } from "../shared/legal";

/**
 * "Our legal documents changed — please review & accept" popup (web, shadcn). Mount it
 * at the shell root ONLY when re-acceptance is due (`needsReacceptance(store.get(),
 * currentVersion)`). `onReview` opens the legal pages on the website (the Phase-2
 * link-out); `onAccept` persists a `LegalAcceptanceRecord` via the shell's store. Copy
 * is injected. Next-free — serves the `app` surface.
 */
export function LegalReacceptancePrompt({
  copy,
  onReview,
  onAccept,
}: {
  copy: LegalReacceptanceCopy;
  onReview: () => void;
  onAccept: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={copy.title}
      className={cn(
        "bg-card text-foreground ring-border/60 fixed inset-x-4 bottom-4 z-50",
        "mx-auto flex w-auto max-w-lg flex-col gap-3 rounded-xl border-0 p-4",
        "shadow-lg ring-1 backdrop-blur",
      )}
    >
      <p className="text-sm font-semibold">{copy.title}</p>
      <p className="text-muted-foreground text-sm">{copy.body}</p>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onReview}>
          {copy.reviewLabel}
        </Button>
        <Button size="sm" onClick={onAccept}>
          {copy.acceptLabel}
        </Button>
      </div>
    </div>
  );
}
