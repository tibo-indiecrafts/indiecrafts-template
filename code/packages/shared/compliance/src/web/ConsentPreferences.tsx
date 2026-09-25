"use client";

/**
 * Renders the per-category consent toggle switches.
 *
 * @see docs/reference/packages/shared/compliance/src/web/ConsentPreferences.md
 */

import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { Switch } from "@indiecrafts/packages-web-ui/web/switch";
import type { ConsentCategory } from "../shared/consent-signals";

/**
 * The per-category consent toggles (web, shadcn). Presentational + controlled — the
 * parent (`ConsentBanner`) owns the `choices` state and the Save button. Required
 * categories render as an always-on, disabled switch. Copy is injected (no i18n dep).
 */
export function ConsentPreferences({
  categories,
  choices,
  onChange,
  className,
}: {
  categories: readonly ConsentCategory[];
  choices: Record<string, boolean>;
  onChange: (key: string, value: boolean) => void;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {categories.map((c) => {
        const id = `consent-${c.key}`;
        return (
          <li key={c.key} className="flex items-start justify-between gap-4">
            <label htmlFor={id} className="flex-1 cursor-pointer">
              <span className="text-foreground block text-sm font-medium">
                {c.title}
              </span>
              {c.description ? (
                <span className="text-muted-foreground mt-0.5 block text-xs">
                  {c.description}
                </span>
              ) : null}
            </label>
            <Switch
              id={id}
              checked={c.required || !!choices[c.key]}
              disabled={c.required}
              onCheckedChange={(v) => onChange(c.key, v)}
            />
          </li>
        );
      })}
    </ul>
  );
}
