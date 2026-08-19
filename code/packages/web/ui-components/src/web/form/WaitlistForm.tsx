"use client";

import { useId, useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@indiecrafts/ui/web/button";
import { Input } from "@indiecrafts/ui/web/input";
import { Checkbox } from "@indiecrafts/ui/web/checkbox";
import { Label } from "@indiecrafts/ui/web/label";
import { cn } from "@indiecrafts/utils/cn";
import type { WaitlistModule } from "@indiecrafts/ui-components/shared/types";
import { TurnstileWidget, turnstileActive } from "./TurnstileWidget";

/** Just the resolved copy — so the form is reusable both as a block and on a full page. */
export type WaitlistFormProps = Omit<
  WaitlistModule,
  "_type" | "_key" | "hidden"
>;

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Waitlist capture form — the client half of `module.waitlist`, rendered by the
 * server `<Waitlist>` wrapper (which owns the feature gate). Every label is a
 * resolved, per-locale string from the block. Posts to `/api/waitlist` → a
 * `waitlistEntry` doc. The name field only shows when `namePlaceholder` is set.
 *
 * `website` is a honeypot: off-screen, hidden from users + assistive tech. Only
 * bots fill it; the server drops those and still answers `201`. `201` → done (new or
 * already-on — deliberately indistinguishable so membership can't be enumerated);
 * anything else → error.
 */
export function WaitlistForm({
  heading,
  body,
  emailPlaceholder = "vous@exemple.com",
  namePlaceholder,
  buttonLabel = "Rejoindre la liste",
  consentText,
  successMessage = "Vous êtes sur la liste — merci !",
  errorMessage = "Une erreur s'est produite. Merci de réessayer.",
  variant = "card",
  anchor,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [tsToken, setTsToken] = useState<string | null>(null);
  const [tsKey, setTsKey] = useState(0); // bump to reset the Turnstile widget after a failed submit
  const [startedAt] = useState(() => Date.now()); // anti-bot: reject near-instant submits server-side
  const locale = useLocale(); // sent so the confirm email + `language` field match the visitor
  const uid = useId();
  const banner = variant === "banner";

  function fail() {
    setStatus("error");
    setTsToken(null);
    setTsKey((k) => k + 1);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          ...(namePlaceholder ? { name } : {}),
          consent,
          language: locale,
          source: window.location.pathname,
          honeypot: website,
          startedAt,
          ...(tsToken ? { "cf-turnstile-response": tsToken } : {}),
        }),
      });
      if (res.status === 201) setStatus("success");
      else fail();
    } catch {
      fail();
    }
  }

  const done = status === "success";

  return (
    <section id={anchor} className="not-prose my-8 md:my-12">
      <div
        className={cn(
          "mx-auto",
          variant === "card" &&
            "bg-card max-w-xl rounded-2xl border p-8 text-center md:p-10",
          variant === "inline" &&
            "flex max-w-3xl flex-col gap-5 rounded-xl border p-6 md:flex-row md:items-center md:justify-between md:gap-8",
          banner &&
            "bg-primary text-primary-foreground max-w-4xl rounded-2xl px-6 py-12 text-center md:py-16",
        )}
      >
        <div
          className={variant === "inline" ? "md:max-w-sm" : "mx-auto max-w-lg"}
        >
          {heading ? (
            <h3
              className={cn(
                "font-sans font-semibold text-balance",
                banner
                  ? "text-2xl md:text-3xl"
                  : "text-foreground text-xl md:text-2xl",
              )}
            >
              {heading}
            </h3>
          ) : null}
          {body ? (
            <p
              className={cn(
                "mt-2 text-pretty",
                banner ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {body}
            </p>
          ) : null}
        </div>

        <div
          className={cn(
            variant === "inline"
              ? "w-full md:max-w-sm"
              : "mx-auto mt-6 max-w-md",
          )}
        >
          {done ? (
            <p
              role="status"
              aria-live="polite"
              className={cn(
                "rounded-lg px-4 py-3 text-sm",
                banner
                  ? "bg-primary-foreground/10"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {successMessage}
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              {/* Honeypot — off-screen, hidden from users + assistive tech. */}
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
              >
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

              {namePlaceholder ? (
                <>
                  <Label htmlFor={`${uid}-name`} className="sr-only">
                    {namePlaceholder}
                  </Label>
                  <Input
                    id={`${uid}-name`}
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    placeholder={namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={
                      banner ? "bg-background text-foreground" : undefined
                    }
                  />
                </>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Label htmlFor={`${uid}-email`} className="sr-only">
                  {emailPlaceholder}
                </Label>
                <Input
                  id={`${uid}-email`}
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder={emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={
                    banner ? "bg-background text-foreground" : undefined
                  }
                />
                <Button
                  type="submit"
                  variant={banner ? "secondary" : "default"}
                  disabled={
                    status === "submitting" ||
                    !consent ||
                    (turnstileActive() && !tsToken)
                  }
                  className="shrink-0"
                >
                  {buttonLabel}
                </Button>
              </div>

              {consentText ? (
                <div className="flex items-start gap-2.5 text-left">
                  <Checkbox
                    id={`${uid}-consent`}
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    className={
                      banner ? "border-primary-foreground/40" : undefined
                    }
                  />
                  <Label
                    htmlFor={`${uid}-consent`}
                    className={cn(
                      "text-xs leading-snug font-normal",
                      banner
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {consentText}
                  </Label>
                </div>
              ) : null}

              <TurnstileWidget key={tsKey} onToken={setTsToken} />

              {status === "error" ? (
                <p
                  role="alert"
                  aria-live="assertive"
                  className={cn(
                    "text-sm",
                    banner ? "text-primary-foreground" : "text-destructive",
                  )}
                >
                  {errorMessage}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
