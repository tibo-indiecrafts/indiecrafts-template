import Link from "next/link";
import { Button } from "@/components/ui-primitives/libre-landing-two-button";
import { CtaIllustration } from "@/components/ui-illustrations/libre-landing-two-cta-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { cta06Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

/**
 * Tailark Pro `libre-landing-two` CallToAction — JSX verbatim.
 * Centered title/body/CTA atop a `CtaIllustration` backdrop.
 */
export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, , tRoot] = useScopedT(cta06Namespace);
  const external = props.primary.href.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`} className="relative border-b">
      <div className="absolute inset-0 mask-b-from-65%">
        <CtaIllustration />
      </div>
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden p-8 md:px-32 md:py-20">
          <div className="relative text-center">
            <h2
              id={`${props.id}-heading`}
              className="text-4xl font-semibold text-balance md:text-5xl"
            >
              {tRoot(props.titleKey)}
            </h2>
            <p className="text-muted-foreground mt-4 mb-6 text-balance">
              {tRoot(props.bodyKey)}
            </p>

            <Button asChild>
              <Link
                href={props.primary.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {tRoot(props.primary.labelKey)}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
