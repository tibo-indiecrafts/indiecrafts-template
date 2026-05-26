"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { newsletter01Namespace } from "./config";
import type { NewsletterBlock } from "./schema";

const FORM_NAME = "newsletter";

/**
 * Newsletter sign-up wired to Netlify Forms.
 *
 * The matching <form> declaration in `public/__forms.html` is what Netlify
 * scans at build time. This component posts URL-encoded data to `/` (which
 * Netlify intercepts and routes by `form-name`). View submissions in your
 * Netlify dashboard → Forms → "newsletter".
 *
 * To swap to a different provider (Resend, Loops, Mailchimp), replace the
 * `submit()` body with a `fetch(...)` to that service.
 */
export default function Newsletter(props: Readonly<NewsletterBlock>) {
  const [, tr] = useScopedT(newsletter01Namespace);
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    try {
      const body = new URLSearchParams({
        "form-name": FORM_NAME,
        email,
        "bot-field": "",
      });
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const isDone = status === "done";

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-muted/30 relative overflow-hidden px-(--gutter) py-20 md:py-28"
    >
      <div className="bg-card ring-border/60 mx-auto max-w-2xl rounded-3xl p-8 text-center shadow-sm ring-1 md:p-14">
        {props.eyebrowKey ? (
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            {tr(props.eyebrowKey, "eyebrow")}
          </p>
        ) : null}

        <h2
          id={`${props.id}-title`}
          className="text-foreground mt-3 pb-1 text-3xl font-semibold text-balance md:text-5xl"
        >
          {tr(props.titleKey, "title")}
        </h2>

        {props.bodyKey ? (
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance md:text-lg">
            {tr(props.bodyKey, "body")}
          </p>
        ) : null}

        <form
          name={FORM_NAME}
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={submit}
          className={cn(
            "mx-auto mt-8 flex max-w-md flex-col gap-2 transition-opacity sm:flex-row",
            isDone && "opacity-60",
          )}
          aria-busy={status === "submitting"}
        >
          <input type="hidden" name="form-name" value={FORM_NAME} />
          {/* Honeypot — bots fill it in, humans don't (it's display:none-style hidden). */}
          <p className="hidden">
            <label>
              Don&apos;t fill this out: <input name="bot-field" />
            </label>
          </p>

          <label htmlFor={inputId} className="sr-only">
            {tr(props.emailPlaceholderKey, "emailPlaceholder")}
          </label>
          <Input
            id={inputId}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={tr(props.emailPlaceholderKey, "emailPlaceholder")}
            disabled={isDone}
            className="bg-background/70 h-12 flex-1 rounded-full border-transparent px-5 text-base shadow-sm backdrop-blur transition focus-visible:ring-2 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            disabled={status === "submitting" || isDone}
            className="h-12 rounded-full px-6 text-base shadow-md transition hover:shadow-lg"
          >
            {isDone ? "✓" : tr(props.submitLabelKey, "submit")}
          </Button>
        </form>

        {status === "error" ? (
          <p className="text-destructive mt-3 text-sm" role="alert">
            {tr(props.errorKey, "error")}
          </p>
        ) : null}

        {props.privacyNoteKey ? (
          <p className="text-muted-foreground/70 mt-4 text-xs">
            {tr(props.privacyNoteKey, "privacy")}
          </p>
        ) : null}
      </div>
    </section>
  );
}
