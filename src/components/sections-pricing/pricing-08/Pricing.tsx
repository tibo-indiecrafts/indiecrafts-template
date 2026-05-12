import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { pricing08Namespace } from "./config";
import type { PricingBlock } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricing08Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h2 id={headingId} className="text-4xl font-medium text-balance">
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            {tRoot(props.bodyKey)}
          </p>
        </div>
        <div className="mt-12 grid gap-6 @xl:grid-cols-2 @xl:gap-3">
          {props.tiers.map((tier, index) => (
            <Card
              key={index}
              className={cn("relative p-6", tier.highlighted && "ring-primary ring-2")}
            >
              <div className="mb-6">
                <h3 className="text-foreground font-medium">{tRoot(tier.nameKey)}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {tRoot(tier.descriptionKey)}
                </p>
              </div>
              <div>
                <span className="text-5xl font-medium">{tRoot(tier.priceKey)}</span>
                <span className="text-muted-foreground">{tRoot(tier.periodKey)}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {tier.featureKeys.map((featureKey) => (
                  <li
                    key={featureKey}
                    className="text-muted-foreground flex items-center gap-2 text-sm"
                  >
                    <Check aria-hidden className="text-primary size-4" />
                    {tRoot(featureKey)}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={tier.highlighted ? "default" : "outline"}
                className="mt-8 w-full gap-2"
              >
                <Link href={tier.cta.href}>
                  {tRoot(tier.cta.labelKey)}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground mt-8 text-center text-sm">
          {tRoot(props.trialNoteKey)}
        </p>
      </div>
    </section>
  );
}
