import * as React from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { pricingComparator04Namespace } from "./config";
import type { ComparatorTier, FeatureValue, PricingBlock } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricingComparator04Namespace);
  const headingId = `${props.id}-heading`;
  const tierCount = props.tiers.length;
  const gridClass =
    tierCount === 2
      ? "grid-cols-3"
      : tierCount === 3
        ? "grid-cols-4"
        : tierCount === 4
          ? "grid-cols-5"
          : "grid-cols-4";

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
        <Card className="mt-12 overflow-auto *:min-w-xl">
          <div className={cn("grid border-b", gridClass)}>
            <div className="p-4" />
            {props.tiers.map((tier) => (
              <TierHeader key={tier.id} tier={tier} tRoot={tRoot} />
            ))}
          </div>
          {props.features.map((feature) => (
            <div
              key={feature.id}
              className={cn("grid border-b last:border-b-0", gridClass)}
            >
              <div className="text-muted-foreground p-4 text-sm">
                {tRoot(feature.labelKey)}
              </div>
              {props.tiers.map((tier) => (
                <ValueCell
                  key={tier.id}
                  value={props.values[feature.id]?.[tier.id]}
                  highlighted={!!tier.highlighted}
                  tRoot={tRoot}
                />
              ))}
            </div>
          ))}
          <div className={cn("grid border-t", gridClass)}>
            <div className="p-4" />
            {props.tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn("border-l p-4", tier.highlighted && "bg-primary/5")}
              >
                <Button
                  asChild
                  variant={tier.highlighted ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                >
                  <Link href={tier.cta.href}>{tRoot(tier.cta.labelKey)}</Link>
                </Button>
              </div>
            ))}
          </div>
        </Card>
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
    <div className={cn("border-l p-4 text-center", tier.highlighted && "bg-primary/5")}>
      <p className="text-foreground font-medium">{tRoot(tier.nameKey)}</p>
      <p className="mt-1">
        <span className="text-2xl font-medium">{tRoot(tier.priceKey)}</span>
        {period && <span className="text-muted-foreground text-sm">{period}</span>}
      </p>
    </div>
  );
};

const ValueCell = ({
  value,
  highlighted,
  tRoot,
}: {
  value: FeatureValue | undefined;
  highlighted: boolean;
  tRoot: (key: never) => string;
}) => (
  <div
    className={cn(
      "flex items-center justify-center border-l p-4 text-sm",
      highlighted && "bg-primary/5",
    )}
  >
    {typeof value === "boolean" ? (
      value ? (
        <Check aria-hidden className="text-primary size-4" />
      ) : (
        <Minus aria-hidden className="text-muted-foreground size-4" />
      )
    ) : value ? (
      <span className="text-foreground">{tRoot(value.labelKey as never)}</span>
    ) : (
      <Minus aria-hidden className="text-muted-foreground size-4" />
    )}
  </div>
);
