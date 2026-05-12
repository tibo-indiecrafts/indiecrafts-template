import Link from "next/link";
import { ChevronRight, Mail } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cta08Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

/**
 * Tailark `veil-call-to-action-3` — JSX verbatim. Centered veil
 * newsletter CTA inside `max-w-2xl @container py-24`. Title +
 * lead body above an inline email-capture row: a `Mail`-iconed
 * input with a focus-within ring + a primary `Subscribe` button
 * with a `ChevronRight` glyph. Mobile stacks the field + button
 * vertically (`@max-md:flex-col`); desktop pins them side-by-side
 * left-aligned (`@xl:text-left`). Default Tailwind font (no
 * `font-serif` override).
 */
export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, , tRoot] = useScopedT(cta08Namespace);
  const headingId = `${props.id}-heading`;
  const inputId = `${props.id}-email`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="grid items-center gap-8 text-center @xl:text-left">
          <div>
            <h2 id={headingId} className="text-3xl font-medium text-balance md:text-4xl">
              {tRoot(props.titleKey)}
            </h2>
            <p className="text-muted-foreground mt-3 text-balance">
              {tRoot(props.bodyKey)}
            </p>
          </div>

          <form
            action=""
            className="flex w-full max-w-sm gap-2 @max-xl:mx-auto @max-md:flex-col"
          >
            <div className="ring-input not-dark:bg-card focus-within:ring-ring/15 focus-within:border-primary relative flex flex-1 items-center overflow-hidden rounded-md border border-transparent ring focus-within:ring-[3px]">
              <Mail
                aria-hidden
                className="text-muted-foreground pointer-events-none absolute left-2.5 size-3.5"
              />
              <label htmlFor={inputId} className="sr-only">
                {tRoot(props.emailLabelKey)}
              </label>
              <input
                id={inputId}
                type="email"
                placeholder={tRoot(props.emailPlaceholderKey)}
                autoComplete="email"
                className="autofill:bg-primary h-8 w-full bg-transparent pr-2.5 pl-8 text-sm outline-none"
              />
            </div>
            <Button asChild className="shrink-0 pr-1.5">
              <Link href={props.cta.href}>
                {tRoot(props.cta.labelKey)}
                <ChevronRight className="opacity-50" />
              </Link>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
