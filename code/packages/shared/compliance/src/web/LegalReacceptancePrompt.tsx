"use client";

/**
 * The "we updated our policies — please accept" banner, shared by every web surface.
 *
 * @see docs/reference/packages/shared/compliance/src/web/LegalReacceptancePrompt.md
 */

import { Fragment, type ComponentType, type ReactNode } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { linkifyMessage } from "../shared/legal";

type LinkProps = { href: string; className?: string; children: ReactNode };

/** Default link: the policy pages live on the website, so open them in a new tab. */
function ExternalLink({ href, className, children }: LinkProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

/**
 * Non-blocking, fixed-bottom, centered banner: one sentence and an Accept button. Mount
 * it only when re-acceptance is due; the caller persists acceptance in `onAccept`.
 * `message` carries `[[…]]` link markers; `hrefs` are the matching policy URLs (privacy ·
 * terms). `link` renders them (the website passes its locale `Link`). The caller decides
 * when it shows (`useOverlayTurn("legal", …)`: one overlay at a time). Copy is injected; Next-free.
 */
export function LegalReacceptancePrompt({
  message,
  hrefs,
  acceptLabel,
  onAccept,
  link: Link = ExternalLink,
}: {
  message: string;
  hrefs: string[];
  acceptLabel: string;
  onAccept: () => void;
  link?: ComponentType<LinkProps>;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-card text-foreground ring-border/60 fixed right-4 bottom-safe-4 left-4 z-50 mx-auto flex w-auto max-w-md flex-col gap-3 rounded-2xl border-0 p-4 shadow-lg ring-1 backdrop-blur sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm">
        {linkifyMessage(message, hrefs).map((part, i) =>
          typeof part === "string" ? (
            <Fragment key={i}>{part}</Fragment>
          ) : (
            <Link
              key={i}
              href={part.href}
              className="underline underline-offset-2"
            >
              {part.label}
            </Link>
          ),
        )}
      </p>
      <Button size="sm" className="shrink-0" onClick={onAccept}>
        {acceptLabel}
      </Button>
    </div>
  );
}
