"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@indiecrafts/ui/button";
import { Switch } from "@indiecrafts/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@indiecrafts/ui/dialog";
import type { ConsentCategory } from "@indiecrafts/utils";
import { applyConsent } from "./consent-store";

type Props = {
  categories: ConsentCategory[];
  version: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The visitor's current choices (to pre-fill the toggles). */
  current: Record<string, boolean>;
};

/** Per-category toggles. Required categories are locked on; optional default off. */
export function CookiePreferences({
  categories,
  version,
  open,
  onOpenChange,
  current,
}: Props) {
  const t = useTranslations("cookies");
  const [draft, setDraft] = useState<Record<string, boolean>>(current);

  // Re-seed the toggles from the stored choices on each open (adjust-state-during-
  // render, not an effect — avoids the cascading render, and won't wipe in-progress
  // toggles if `current` changes while the dialog is open).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(current);
  }

  const commit = (choices: Record<string, boolean>) => {
    applyConsent(categories, choices, version);
    onOpenChange(false);
  };
  const allOptional = (value: boolean) =>
    Object.fromEntries(categories.filter((c) => !c.required).map((c) => [c.key, value]));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("preferencesTitle")}</DialogTitle>
          <DialogDescription>{t("preferencesBody")}</DialogDescription>
        </DialogHeader>

        <ul className="divide-border/60 divide-y">
          {categories.map((c) => (
            <li key={c.key} className="flex items-start justify-between gap-4 py-3">
              <div className="text-sm">
                <p className="font-medium">{c.title}</p>
                {c.description ? (
                  <p className="text-muted-foreground mt-0.5">{c.description}</p>
                ) : null}
              </div>
              <Switch
                checked={c.required || Boolean(draft[c.key])}
                disabled={c.required}
                aria-label={c.title}
                onCheckedChange={(v: boolean) => setDraft((d) => ({ ...d, [c.key]: v }))}
                className="mt-0.5 shrink-0"
              />
            </li>
          ))}
        </ul>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="ghost" size="sm" onClick={() => commit(allOptional(false))}>
            {t("rejectAll")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => commit(allOptional(true))}>
              {t("acceptAll")}
            </Button>
            <Button size="sm" onClick={() => commit(draft)}>
              {t("save")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
