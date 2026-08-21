"use client";

import { useState } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Link } from "@/i18n/routing";

type Status = "idle" | "submitting" | "confirmed" | "invalid";

export type NewsletterConfirmLabels = {
  heading: string;
  body: string;
  button: string;
  confirmedHeading: string;
  confirmedBody: string;
  invalidHeading: string;
  invalidBody: string;
  homeCta: string;
};

/**
 * Double opt-in confirm — the interactive half of the confirm page. The email
 * links to the page (a bare GET never mutates); clicking here POSTs the one-time
 * token to `/api/newsletter/confirm`, so a mail scanner or link prefetcher can't
 * confirm a subscription without a human tap. A missing token starts invalid.
 */
export function NewsletterConfirm({
  token,
  labels,
}: {
  token: string;
  labels: NewsletterConfirmLabels;
}) {
  const [status, setStatus] = useState<Status>(token ? "idle" : "invalid");

  async function confirm() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: string };
      setStatus(res.ok && data.status === "confirmed" ? "confirmed" : "invalid");
    } catch {
      setStatus("invalid");
    }
  }

  if (status === "confirmed" || status === "invalid") {
    const confirmed = status === "confirmed";
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-4">
        <h1 className="text-foreground text-2xl font-semibold text-balance md:text-3xl">
          {confirmed ? labels.confirmedHeading : labels.invalidHeading}
        </h1>
        <p className="text-muted-foreground max-w-md text-pretty">
          {confirmed ? labels.confirmedBody : labels.invalidBody}
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/">{labels.homeCta}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-foreground text-2xl font-semibold text-balance md:text-3xl">
        {labels.heading}
      </h1>
      <p className="text-muted-foreground max-w-md text-pretty">{labels.body}</p>
      <Button onClick={confirm} disabled={status === "submitting"} className="mt-2">
        {labels.button}
      </Button>
    </div>
  );
}
