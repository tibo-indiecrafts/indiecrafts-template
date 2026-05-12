import Link from "next/link";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cta12Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

/**
 * Tailark `call-to-action-1` — JSX verbatim. Centered closer CTA
 * on `py-16 md:py-32` inside `max-w-5xl`. `text-4xl lg:text-5xl
 * font-semibold` headline + 1-line body, then a `flex flex-wrap
 * justify-center gap-4 mt-12` row of dual large CTAs (primary
 * "Get Started" + outline "Book Demo").
 */
export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, , tRoot] = useScopedT(cta12Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 id={headingId} className="text-4xl font-semibold text-balance lg:text-5xl">
            {tRoot(props.titleKey)}
          </h2>
          <p className="mt-4">{tRoot(props.bodyKey)}</p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href={props.primary.href}>
                <span>{tRoot(props.primary.labelKey)}</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href={props.secondary.href}>
                <span>{tRoot(props.secondary.labelKey)}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
