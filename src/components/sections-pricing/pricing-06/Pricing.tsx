import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { pricing06Namespace } from "./config";
import type { PricingBlock } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border", className)}
    {...props}
  />
);

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricing06Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 id={headingId} className="text-4xl font-medium text-balance">
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            {tRoot(props.bodyKey)}
          </p>
        </div>
        <div className="mt-12 space-y-3">
          {props.tiers.map((tier, index) => {
            const period = tRoot(tier.periodKey);
            return (
              <Card
                key={index}
                className={cn(
                  "flex flex-col gap-4 p-4 @2xl:flex-row @2xl:items-center @2xl:justify-between",
                  tier.highlighted && "ring-primary ring-2",
                )}
              >
                <div className="flex flex-col gap-2 @2xl:flex-row @2xl:items-center @2xl:gap-6">
                  <div className="shrink-0 @2xl:w-44">
                    <h3 className="text-foreground font-medium">{tRoot(tier.nameKey)}</h3>
                    <p className="text-muted-foreground text-sm">
                      {tRoot(tier.descriptionKey)}
                    </p>
                  </div>
                  <div className="@2xl:border-l @2xl:pl-6">
                    <p className="text-muted-foreground text-sm">
                      {tRoot(tier.limitKey)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-center">
                  <div className="@2xl:text-right">
                    <span className="text-2xl font-medium">{tRoot(tier.priceKey)}</span>
                    {period && (
                      <span className="text-muted-foreground text-sm">{period}</span>
                    )}
                  </div>
                  <Button
                    asChild
                    variant={tier.highlighted ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                  >
                    <Link href={tier.ctaHref}>
                      {tRoot(tier.ctaLabelKey)}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="bg-muted mt-8 rounded-xl p-6 text-center">
          <p className="text-foreground font-medium">{tRoot(props.footnoteHeadingKey)}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {tRoot(props.footnoteBodyKey)}
          </p>
        </div>
      </div>
    </section>
  );
}
