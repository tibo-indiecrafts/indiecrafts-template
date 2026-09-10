"use client";

import { useState } from "react";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import type { ConsentCategory } from "../shared/consent-signals";
import type { ConsentBannerCopy } from "../shared/consent";
import { ConsentPreferences } from "./ConsentPreferences";

/**
 * The shared cookie-consent banner (web, shadcn) — Next-free, so the plain-React
 * `app` surface both use it. Mount it at the shell root
 * ONLY when consent is needed (the shell reads its `ConsentStore` + the `requireConsent`
 * flag). Copy + `categories` are injected — no next-intl, no Sanity inside. Three one-tap
 * choices (Accept all · Reject · Customize); Customize expands the per-category toggles.
 */
export function ConsentBanner({
  categories,
  copy,
  initialChoices = {},
  onAccept,
  onReject,
  onSave,
}: {
  categories: readonly ConsentCategory[];
  copy: ConsentBannerCopy;
  initialChoices?: Record<string, boolean>;
  onAccept: () => void;
  onReject: () => void;
  onSave: (choices: Record<string, boolean>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [choices, setChoices] =
    useState<Record<string, boolean>>(initialChoices);

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={copy.title ?? copy.body}
      className={cn(
        "bg-card text-foreground ring-border/60 fixed inset-x-4 bottom-4 z-50",
        "mx-auto flex w-auto max-w-lg flex-col gap-3 rounded-xl border-0 p-4",
        "shadow-lg ring-1 backdrop-blur",
      )}
    >
      {copy.title ? (
        <p className="text-sm font-semibold">{copy.title}</p>
      ) : null}
      <p className="text-muted-foreground text-sm">{copy.body}</p>

      {expanded ? (
        <ConsentPreferences
          categories={categories}
          choices={choices}
          onChange={(key, value) =>
            setChoices((prev) => ({ ...prev, [key]: value }))
          }
          className="my-1"
        />
      ) : null}

      <div className="flex flex-wrap justify-end gap-2">
        {expanded ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(false)}
            >
              {copy.backLabel}
            </Button>
            <Button size="sm" onClick={() => onSave(choices)}>
              {copy.saveLabel}
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(true)}>
              {copy.customizeLabel}
            </Button>
            <Button variant="outline" size="sm" onClick={onReject}>
              {copy.rejectLabel}
            </Button>
            <Button size="sm" onClick={onAccept}>
              {copy.acceptLabel}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
