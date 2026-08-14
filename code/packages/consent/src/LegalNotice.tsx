"use client";

import { useState } from "react";
import { Link } from "@indiecrafts/i18n";
import { Button } from "@indiecrafts/ui/web/button";
import { useConsent } from "./useConsent";
import { acceptLegal } from "./legal-store";

type Props = {
  /** Effective legal version (from `getLegalAcceptance`) — deposited on Accept. */
  version: string;
  message: string;
  reviewLabel: string;
  /** Path to review — the app passes the first flag-enabled legal page. */
  reviewHref: string;
  acceptLabel: string;
};

/**
 * "We updated our policies — please Accept" banner. Non-blocking, fixed-bottom,
 * token-styled (the sibling of `CookieBanner`). The layout renders it only when the
 * deposited `legal-ack` cookie differs from the live version, so this component just
 * writes the cookie on Accept and hides — no polling. i18n-agnostic: copy in as props.
 *
 * Stacks ABOVE the cookie banner while cookie consent is still undecided (both are
 * bottom-fixed); drops to the resting position once consent is decided.
 */
export function LegalNotice({
  version,
  message,
  reviewLabel,
  reviewHref,
  acceptLabel,
}: Props) {
  const [accepted, setAccepted] = useState(false);
  const { decided } = useConsent();
  if (accepted) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`bg-card text-foreground ring-border/60 fixed right-4 left-4 z-50 mx-auto flex w-auto max-w-md flex-col gap-3 rounded-2xl border-0 p-4 shadow-lg ring-1 backdrop-blur sm:flex-row sm:items-center sm:justify-between ${decided ? "bottom-4" : "bottom-28"}`}
    >
      <p className="text-sm">{message}</p>
      <div className="flex shrink-0 gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={reviewHref}>{reviewLabel}</Link>
        </Button>
        <Button
          size="sm"
          onClick={() => {
            acceptLegal(version);
            setAccepted(true);
          }}
        >
          {acceptLabel}
        </Button>
      </div>
    </div>
  );
}
