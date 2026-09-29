"use client";

/**
 * Prompts review and re-acceptance of changed legal documents.
 *
 * @see docs/reference/packages/shared/compliance/src/web/LegalReacceptancePrompt.md
 */

import { Fragment } from "react";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { linkifyMessage, type LegalReacceptanceCopy } from "../shared/legal";

/**
 * "Our legal documents changed — please accept" popup (web, shadcn). Mount it at the
 * shell root ONLY when re-acceptance is due (`needsReacceptance(store.get(),
 * currentVersion)`). `copy.body` carries `[[…]]` link markers; `hrefs` are the matching
 * policy URLs (privacy · terms) woven into the sentence as inline `<a>` link-outs to the
 * website. `onAccept` persists a `LegalAcceptanceRecord` via the shell's store. Copy is
 * injected. Next-free — serves the `app` surface.
 */
export function LegalReacceptancePrompt({
  copy,
  hrefs,
  onAccept,
}: {
  copy: LegalReacceptanceCopy;
  hrefs: string[];
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
      <p className="text-muted-foreground text-sm">
        {linkifyMessage(copy.body, hrefs).map((part, i) =>
          typeof part === "string" ? (
            <Fragment key={i}>{part}</Fragment>
          ) : (
            <a
              key={i}
              href={part.href}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-2"
            >
              {part.label}
            </a>
          ),
        )}
      </p>
      <div className="flex justify-end">
        <Button size="sm" onClick={onAccept}>
          {copy.acceptLabel}
        </Button>
      </div>
    </div>
  );
}
