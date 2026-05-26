import * as React from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/components/_lib/scoped-t";
import { pricingComparator03Namespace } from "./config";
import type {
  ComparatorFeature,
  ComparatorTier,
  FeatureValue,
  PricingBlock,
} from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricingComparator03Namespace);
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
        <div className="mt-12 space-y-4">
          {props.tiers.map((tier, index) => (
            <Card
              key={index}
              className={cn("p-6", tier.highlighted && "ring-primary ring-2")}
            >
              <div className="flex flex-col gap-6 @lg:flex-row @lg:items-start @lg:justify-between">
                <TierHeader tier={tier} tRoot={tRoot} />
                <div className="w-full shrink-0 @lg:w-64">
                  {props.features.map((feature) => (
                    <FeatureRow
                      key={feature.id}
                      feature={feature}
                      value={tier.values[feature.id]}
                      tRoot={tRoot}
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const TierHeader = ({
  tier,
  tRoot,
}: {
  tier: ComparatorTier;
  tRoot: (key: ComparatorTier["nameKey"]) => string;
}) => {
  const period = tRoot(tier.periodKey);
  return (
    <div className="@lg:max-w-xs">
      <h3 className="text-foreground font-medium">{tRoot(tier.nameKey)}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{tRoot(tier.descriptionKey)}</p>
      <div className="mt-4">
        <span className="text-3xl font-medium">{tRoot(tier.priceKey)}</span>
        {period && <span className="text-muted-foreground">{period}</span>}
      </div>
      <Button
        asChild
        variant={tier.highlighted ? "default" : "outline"}
        size="sm"
        className="mt-4"
      >
        <Link href={tier.cta.href}>{tRoot(tier.cta.labelKey)}</Link>
      </Button>
    </div>
  );
};

const FeatureRow = ({
  feature,
  value,
  tRoot,
}: {
  feature: ComparatorFeature;
  value: FeatureValue | undefined;
  tRoot: (key: ComparatorFeature["labelKey"]) => string;
}) => (
  <div className="flex items-center justify-between border-b py-3 text-sm last:border-b-0">
    <span className="text-muted-foreground">{tRoot(feature.labelKey)}</span>
    {typeof value === "boolean" ? (
      value ? (
        <Check aria-hidden className="text-primary size-4" />
      ) : (
        <Minus aria-hidden className="text-muted-foreground/50 size-4" />
      )
    ) : value ? (
      <span className="text-foreground font-medium">{tRoot(value.labelKey)}</span>
    ) : (
      <Minus aria-hidden className="text-muted-foreground/50 size-4" />
    )}
  </div>
);
