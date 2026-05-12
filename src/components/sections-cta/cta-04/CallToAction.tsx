import Link from "next/link";
import { Button } from "@/components/ui-primitives/grid-2-landing-button";
import {
  Container,
  Separator,
} from "@/components/ui-primitives/grid-2-landing-container";
import { useScopedT } from "@/i18n/scoped-t";
import { cta04Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

/**
 * CTA-04 — JSX verbatim. Sandwiched between two h-16 separators,
 * with a centered title + body + CTA inside a non-asGrid Container.
 */
export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, , tRoot] = useScopedT(cta04Namespace);
  const external = props.primary.href.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <Separator className="h-16" />
      <Container>
        <div className="relative overflow-hidden p-6 @lg:p-8 @3xl:p-20">
          <div className="mx-auto max-w-xl text-center">
            <h2
              id={`${props.id}-heading`}
              className="text-foreground text-4xl font-semibold text-balance lg:text-5xl"
            >
              {tRoot(props.titleKey)}
            </h2>
            <p className="text-foreground mt-4 mb-6 text-lg text-balance">
              {tRoot(props.bodyKey)}
            </p>
            <Button
              asChild
              size="lg"
              className="px-4 text-sm shadow-xl shadow-indigo-900/40"
            >
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
      </Container>
      <Separator className="h-16" />
    </section>
  );
}
