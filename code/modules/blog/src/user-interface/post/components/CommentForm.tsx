"use client";

import { useState } from "react";
import { Button } from "@indiecrafts/ui/button";
import { Input } from "@indiecrafts/ui/input";
import { Textarea } from "@indiecrafts/ui/textarea";
import { Checkbox } from "@indiecrafts/ui/checkbox";
import { Label } from "@indiecrafts/ui/label";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Comment form — posts to `/api/comments`. i18n-agnostic: every label is a
 * resolved string passed in by the server `<Comments>` (from the editable
 * `blog.comments` copy). A submitted comment lands unapproved, so on success we
 * show the "awaiting review" message rather than optimistically inserting it.
 *
 * `website` is a honeypot: hidden off-screen from users + assistive tech; only
 * bots fill it, and the server drops those silently.
 */
export function CommentForm({
  postId,
  parentId,
  compact = false,
  nameLabel,
  emailLabel,
  bodyLabel,
  consentLabel,
  submitLabel,
  successMessage,
  errorMessage,
}: {
  postId: string;
  /** Set on a reply form → the new comment threads under this parent. */
  parentId?: string;
  /** Tighter layout for an inline reply form. */
  compact?: boolean;
  nameLabel: string;
  emailLabel: string;
  bodyLabel: string;
  consentLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          postId,
          parentId,
          authorName: name,
          authorEmail: email || undefined,
          body,
          consent,
          honeypot: website,
        }),
      });
      if (res.status === 201) {
        setStatus("success");
        setName("");
        setEmail("");
        setBody("");
        setConsent(false);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="bg-muted text-muted-foreground rounded-lg p-4 text-sm" role="status">
        {successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot — off-screen, hidden from users + assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div className={compact ? "grid gap-3" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-1.5">
          <Label htmlFor="c-name">{nameLabel}</Label>
          <Input
            id="c-name"
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="c-email">{emailLabel}</Label>
          <Input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="c-body">{bodyLabel}</Label>
        <Textarea
          id="c-body"
          required
          rows={4}
          maxLength={2000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox
          id="c-consent"
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
        />
        <Label htmlFor="c-consent" className="text-muted-foreground text-sm leading-snug font-normal">
          {consentLabel}
        </Label>
      </div>

      {status === "error" ? (
        <p className="text-destructive text-sm" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={status === "submitting" || !consent}>
        {submitLabel}
      </Button>
    </form>
  );
}
