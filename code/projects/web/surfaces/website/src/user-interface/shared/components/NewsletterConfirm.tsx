"use client";

/**
 * Confirm a newsletter subscription by POSTing the signed token on a human tap.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/components/NewsletterConfirm.md
 */

import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Link } from "@/i18n/routing";

type Status = "idle" | "submitting" | "confirmed" | "invalid" | "error";

export type NewsletterConfirmLabels = {
  heading: string;
  body: string;
  button: string;
  confirmedHeading: string;
  confirmedBody: string;
  invalidHeading: string;
  invalidBody: string;
  errorHeading: string;
  errorBody: string;
  homeCta: string;
};

/** The signed token from the `#t=` fragment, read once per page load: the page then drops
 *  it from the address bar, and the snapshot must not change when it does (React re-runs
 *  effects in dev). A confirm link always opens a fresh page load from the email. */
let captured: string | undefined;
function readToken(): string {
  captured ??= new URLSearchParams(window.location.hash.slice(1)).get("t")?.trim() ?? "";
  return captured;
}
const subscribe = () => () => {};

/**
 * Double opt-in confirm — the interactive half of the confirm page. The email links to
 * the page with the token in the URL **fragment**: browsers never send it to a server,
 * so the address it carries stays out of request logs. On mount the token is read and
 * dropped from the address bar; clicking the button POSTs it to `/api/newsletter/confirm`,
 * so a mail scanner or link prefetcher can't confirm without a human tap. No token →
 * invalid. A failed save → error, and the button stays to try again.
 */
export function NewsletterConfirm({ labels }: { labels: NewsletterConfirmLabels }) {
  // null on the server (no fragment there); the token, or "" for none, in the browser.
  const token = useSyncExternalStore(subscribe, readToken, () => null);
  const [state, setStatus] = useState<Status>("idle");
  const status: Status = token === "" ? "invalid" : state;

  useEffect(() => {
    if (token)
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
  }, [token]);

  async function confirm() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: string };
      setStatus(
        data.status === "confirmed"
          ? "confirmed"
          : data.status === "invalid"
            ? "invalid"
            : "error",
      );
    } catch {
      setStatus("error");
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

  const failed = status === "error";
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-foreground text-2xl font-semibold text-balance md:text-3xl">
        {failed ? labels.errorHeading : labels.heading}
      </h1>
      <p
        role={failed ? "alert" : undefined}
        className="text-muted-foreground max-w-md text-pretty"
      >
        {failed ? labels.errorBody : labels.body}
      </p>
      <Button
        onClick={confirm}
        disabled={!token || status === "submitting"}
        className="mt-2"
      >
        {labels.button}
      </Button>
    </div>
  );
}
