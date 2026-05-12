import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cta11Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

/**
 * Tailark `mist-call-to-action-3` — JSX verbatim. Mist banner CTA
 * on `bg-muted py-12` inside `max-w-5xl`. Headline uses a 2-tone
 * effect: a muted prefix span (e.g. "Build Modern Websites.") + a
 * foreground emphasis tail (e.g. "Drive Results"). Below: lead
 * body and dual CTAs — primary "Try Mist for Free" with right
 * `ChevronRight` glyph + outline "Request a Demo" with leading
 * `Calendar` glyph.
 */
export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, , tRoot] = useScopedT(cta11Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="bg-muted py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2
            id={headingId}
            className="text-foreground max-w-lg text-3xl font-semibold text-balance lg:text-4xl"
          >
            <span className="text-muted-foreground">{tRoot(props.titleMutedKey)}</span>
            {tRoot(props.titleAccentKey)}
          </h2>
          <p className="mt-4 text-lg">{tRoot(props.bodyKey)}</p>
          <div className="mt-8 flex gap-3">
            <Button asChild className="pr-2">
              <Link href={props.primary.href}>
                {tRoot(props.primary.labelKey)}
                <ChevronRight strokeWidth={2.5} className="size-3.5! opacity-50" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="pl-2.5">
              <Link href={props.secondary.href}>
                <Calendar className="!size-3.5 opacity-50" strokeWidth={2.5} />
                {tRoot(props.secondary.labelKey)}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
