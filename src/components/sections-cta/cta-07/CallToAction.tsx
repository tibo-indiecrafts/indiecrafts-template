import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { cta07Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

/** Plain card chrome — no baked padding/flex so the consumer's
 *  `grid grid-cols-2 p-6` overrides apply cleanly. */
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, , tRoot] = useScopedT(cta07Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <Card className="grid gap-8 p-6 md:p-8 @xl:grid-cols-2">
          <div>
            <h2 id={headingId} className="text-3xl font-medium text-balance">
              {tRoot(props.titleKey)}
            </h2>
            <p className="text-muted-foreground mt-3 text-balance">
              {tRoot(props.bodyKey)}
            </p>
            <ul className="mt-6 space-y-2">
              {props.benefits.map((benefitKey) => (
                <li
                  key={benefitKey}
                  className="text-muted-foreground flex items-center gap-2 text-sm"
                >
                  <Check aria-hidden className="text-primary size-4" />
                  {tRoot(benefitKey)}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted/50 flex flex-col justify-center rounded-xl border p-6">
            <p className="text-muted-foreground text-sm">{tRoot(props.pricePrefixKey)}</p>
            <p className="mt-1 text-4xl font-medium">
              {tRoot(props.priceValueKey)}
              <span className="text-muted-foreground text-lg font-normal">
                {tRoot(props.pricePeriodKey)}
              </span>
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {tRoot(props.priceCaptionKey)}
            </p>
            <Button asChild className="mt-6 gap-2">
              <Link href={props.cta.href}>
                {tRoot(props.cta.labelKey)}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
