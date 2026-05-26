"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { Textarea } from "@/components/ui-primitives/textarea";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { contactNetlify01Namespace } from "./config";
import type { ContactNetlifyBlock } from "./schema";

const FORM_NAME = "contact";

/**
 * Contact form wired to Netlify Forms — works on Netlify with zero backend.
 *
 * Setup:
 *   1. The matching <form> declaration in `public/__forms.html` is what
 *      Netlify scans at build time. Don't delete that file.
 *   2. Deploy to Netlify. Submissions appear under Forms → "contact".
 *   3. Wire email/Slack notifications in the Netlify dashboard (Forms → Settings).
 *
 * Local dev: submissions hit the dev server's root and fail silently —
 * this is expected. Test by deploying to a Netlify branch preview.
 */
export default function ContactNetlify(props: Readonly<ContactNetlifyBlock>) {
  const [, tr] = useScopedT(contactNetlify01Namespace);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const data = new FormData(e.currentTarget);
      data.set("form-name", FORM_NAME);
      const body = new URLSearchParams(data as unknown as Record<string, string>);
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
      className="bg-muted/30 px-(--gutter) py-20 md:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          {props.eyebrowKey ? (
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
              {tr(props.eyebrowKey, "eyebrow")}
            </p>
          ) : null}
          <h2
            id={`${props.id}-title`}
            className="text-foreground mt-3 text-3xl font-semibold text-balance md:text-5xl"
          >
            {tr(props.titleKey, "title")}
          </h2>
          {props.bodyKey ? (
            <p className="text-muted-foreground mt-4 text-balance md:text-lg">
              {tr(props.bodyKey, "body")}
            </p>
          ) : null}
        </div>

        {isDone ? (
          <p
            role="status"
            className="bg-card ring-border/60 mt-10 rounded-2xl p-8 text-center shadow-sm ring-1"
          >
            {tr(props.successKey, "success")}
          </p>
        ) : (
          <form
            name={FORM_NAME}
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={submit}
            className={cn(
              "bg-card ring-border/60 mt-10 grid gap-5 rounded-2xl p-8 shadow-sm ring-1 md:p-10",
            )}
            aria-busy={status === "submitting"}
          >
            <input type="hidden" name="form-name" value={FORM_NAME} />
            <p className="hidden">
              <label>
                Don&apos;t fill this out: <input name="bot-field" />
              </label>
            </p>

            <div className="grid gap-2">
              <Label htmlFor={nameId}>{tr(props.nameLabelKey, "nameLabel")}</Label>
              <Input
                id={nameId}
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder={tr(props.namePlaceholderKey, "namePlaceholder")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={emailId}>{tr(props.emailLabelKey, "emailLabel")}</Label>
              <Input
                id={emailId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder={tr(props.emailPlaceholderKey, "emailPlaceholder")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={messageId}>
                {tr(props.messageLabelKey, "messageLabel")}
              </Label>
              <Textarea
                id={messageId}
                name="message"
                required
                rows={5}
                placeholder={tr(props.messagePlaceholderKey, "messagePlaceholder")}
              />
            </div>

            <Button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 w-full sm:w-auto sm:justify-self-end"
            >
              {tr(props.submitLabelKey, "submit")}
            </Button>

            {status === "error" ? (
              <p className="text-destructive text-sm" role="alert">
                {tr(props.errorKey, "error")}
              </p>
            ) : null}

            {props.privacyNoteKey ? (
              <p className="text-muted-foreground/70 text-xs">
                {tr(props.privacyNoteKey, "privacy")}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
