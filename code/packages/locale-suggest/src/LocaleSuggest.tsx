"use client";

import { useState } from "react";
import { useLocaleSwitch } from "@indiecrafts/i18n";
import { Button } from "@indiecrafts/ui/web/button";
import { dismissLocaleSuggest } from "./locale-suggest-store";

/**
 * "This site is available in {your language}" suggestion strip. Non-intrusive
 * (a top strip in `<main>`, keeps the visitor on the page — never auto-redirects).
 * The layout renders it only when the browser's preferred locale differs from the
 * active one AND the dismiss cookie is unset (decided server-side). Switch or
 * dismiss both write the cookie, so it doesn't nag again. Copy in as props;
 * `{language}` is filled with the target language's native name.
 */
export function LocaleSuggest({
  suggested,
  suggestedLabel,
  message,
  switchLabel,
  dismissLabel,
}: {
  /** Locale code to switch to (e.g. "fr"). */
  suggested: string;
  /** Native language name shown in the copy (e.g. "Français"). */
  suggestedLabel: string;
  message: string;
  switchLabel: string;
  dismissLabel: string;
}) {
  const [hidden, setHidden] = useState(false);
  const switchTo = useLocaleSwitch();
  if (hidden) return null;

  const fill = (s: string) => s.replaceAll("{language}", suggestedLabel);

  return (
    <aside
      role="region"
      aria-label={fill(message)}
      className="bg-card text-foreground flex w-full flex-col items-center justify-center gap-2 border-b px-4 py-2.5 text-sm sm:flex-row sm:gap-3"
    >
      <p className="text-center">{fill(message)}</p>
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            dismissLocaleSuggest();
            setHidden(true);
          }}
        >
          {fill(dismissLabel)}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            dismissLocaleSuggest();
            void switchTo(suggested);
          }}
        >
          {fill(switchLabel)}
        </Button>
      </div>
    </aside>
  );
}
