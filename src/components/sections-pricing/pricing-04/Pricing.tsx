import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { pricing04Namespace } from "./config";
import type { PricingBlock } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricing04Namespace);
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
        <div className="mt-12 grid gap-3 @3xl:grid-cols-2">
          {props.tiers.map((tier, index) => (
            <Card
              key={index}
              className={cn(
                "relative flex flex-col p-6 last:col-span-full",
                tier.highlighted && "ring-primary ring-2",
              )}
            >
              <div>
                <h3 className="text-foreground font-medium">{tRoot(tier.nameKey)}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {tRoot(tier.descriptionKey)}
                </p>
              </div>
              <div className="mt-6">
                <span className="text-4xl font-medium">{tRoot(tier.priceKey)}</span>
                <span className="text-muted-foreground">{tRoot(tier.periodKey)}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.featureKeys.map((featureKey) => (
                  <li
                    key={featureKey}
                    className="text-muted-foreground flex items-start gap-2 text-sm"
                  >
                    <Check aria-hidden className="text-primary mt-0.5 size-4 shrink-0" />
                    {tRoot(featureKey)}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={tier.highlighted ? "default" : "outline"}
                className="mt-8 w-full"
              >
                <Link href={tier.cta.href}>{tRoot(tier.cta.labelKey)}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
