"use client";

import { useState, type FormEvent } from "react";
import { logger } from "@/lib/logger";

/**
 * Newsletter signup form. The default `endpoint` (`/api/newsletter`) is
 * a STUB — no such route ships with this template. Override the prop
 * with your own URL (ConvertKit, Mailchimp, Buttondown, a custom
 * /api route, …) before the form will actually deliver anywhere; until
 * then the form will surface the `errorLabel` on submit.
 *
 * The component intentionally does not bundle a third-party provider so
 * the template stays neutral about which service you pick.
 */
export function NewsletterSignup({
  heading,
  subheading,
  placeholder,
  submitLabel,
  successLabel,
  errorLabel,
  endpoint = "/api/newsletter",
}: {
  heading: string;
  subheading: string;
  placeholder: string;
  submitLabel: string;
  successLabel: string;
  errorLabel: string;
  endpoint?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 10_000);
    } catch (err) {
      logger.error("Newsletter signup failed", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 10_000);
    }
  }

  return (
    <section aria-labelledby="newsletter-title" className="bg-muted/40 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-(--gutter)">
        <div className="bg-card ring-border/60 flex flex-col items-center justify-between gap-6 rounded-xl px-6 py-8 text-center shadow-sm ring-1 sm:gap-10 sm:px-12 lg:flex-row lg:text-left">
          <div className="flex flex-col gap-4">
            <h2 id="newsletter-title" className="text-2xl font-semibold md:text-3xl">
              {heading}
            </h2>
            <p className="text-muted-foreground max-w-xl">{subheading}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-2 lg:w-auto"
            aria-describedby={status === "success" ? "newsletter-feedback" : undefined}
          >
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:gap-0">
              <label htmlFor="newsletter-email" className="sr-only">
                {placeholder}
              </label>
              <input
                id="newsletter-email"
                required
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="bg-background ring-border placeholder:text-muted-foreground focus-visible:ring-ring grow rounded-l-md px-4 py-3 ring-1 focus-visible:ring-2 focus-visible:outline-none sm:rounded-r-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-brand text-brand-foreground hover:bg-brand/90 focus-visible:ring-ring rounded-r-md px-8 py-3 font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60 sm:rounded-l-none"
              >
                {submitLabel}
              </button>
            </div>
            {status === "success" ? (
              <p id="newsletter-feedback" className="text-brand text-sm">
                {successLabel}
              </p>
            ) : null}
            {status === "error" ? (
              <p id="newsletter-feedback" className="text-destructive text-sm">
                {errorLabel}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
