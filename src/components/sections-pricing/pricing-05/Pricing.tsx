import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { pricing05Namespace } from "./config";
import type { PricingBlock, PricingTier } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricing05Namespace);
  const headingId = `${props.id}-heading`;
  const [left, right] = props.outer;

  return (
    <section aria-labelledby={headingId}>
      <div className="bg-muted relative py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id={headingId}
              className="text-3xl font-bold text-balance md:text-4xl lg:text-5xl"
            >
              {tRoot(props.titleKey)}
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg text-balance">
              {tRoot(props.bodyKey)}
            </p>
          </div>
          <div className="@container relative mt-12 md:mt-20">
            <Card className="relative mx-auto max-w-sm @4xl:max-w-full">
              <div className="grid @4xl:grid-cols-3">
                <Tier tier={left} tRoot={tRoot} />
                <div className="ring-foreground/10 bg-background -mx-1 rounded-(--radius) border-transparent shadow ring-1 @3xl:mx-0 @3xl:-my-3">
                  <div className="relative px-1 @3xl:px-0 @3xl:py-3">
                    <Tier tier={props.highlighted} tRoot={tRoot} highlighted />
                  </div>
                </div>
                <Tier tier={right} tRoot={tRoot} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

const Tier = ({
  tier,
  tRoot,
  highlighted = false,
}: {
  tier: PricingTier;
  tRoot: (key: PricingTier["nameKey"]) => string;
  highlighted?: boolean;
}) => (
  <div>
    <div className="p-8">
      <div className="font-medium">{tRoot(tier.nameKey)}</div>
      <span className="mt-2 mb-0.5 block text-2xl font-semibold">
        {tRoot(tier.priceKey)}
      </span>
      <div className="text-muted-foreground text-sm">{tRoot(tier.cadenceKey)}</div>
    </div>
    <div className={cn("border-y px-8 py-4", highlighted && "-mx-1 @3xl:mx-0")}>
      <Button asChild variant={highlighted ? "default" : "outline"} className="w-full">
        <Link href={tier.cta.href}>{tRoot(tier.cta.labelKey)}</Link>
      </Button>
    </div>
    <ul className="space-y-3 p-8">
      {tier.featureKeys.map((key) => (
        <li key={key} className="flex items-center gap-2">
          <Check aria-hidden className="text-primary size-3" strokeWidth={3.5} />
          {tRoot(key)}
        </li>
      ))}
    </ul>
  </div>
);
