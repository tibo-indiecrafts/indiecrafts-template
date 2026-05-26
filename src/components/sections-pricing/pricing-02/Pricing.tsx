import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/components/_lib/scoped-t";
import { pricing02Namespace } from "./config";
import type { PricingBlock, PricingTier } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 pt-6", className)} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-4", className)} {...props} />
);

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 pt-2 pb-6", className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-base", className)} {...props} />
);

const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-muted-foreground", className)} {...props} />
);

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricing02Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 id={headingId} className="text-center text-4xl font-semibold lg:text-5xl">
            {tRoot(props.titleKey)}
          </h1>
          <p>{tRoot(props.bodyKey)}</p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          {props.tiers.map((tier, index) => (
            <TierCard key={index} tier={tier} tRoot={tRoot} />
          ))}
        </div>
      </div>
    </section>
  );
}

const TierCard = ({
  tier,
  tRoot,
}: {
  tier: PricingTier;
  tRoot: (key: PricingTier["nameKey"]) => string;
}) => {
  const inner = (
    <>
      <CardHeader>
        <CardTitle className="font-medium">{tRoot(tier.nameKey)}</CardTitle>
        <span className="my-3 block text-2xl font-semibold">{tRoot(tier.priceKey)}</span>
        <CardDescription className="text-sm">{tRoot(tier.cadenceKey)}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <hr className="border-dashed" />
        <ul className="list-outside space-y-3 text-sm">
          {tier.featureKeys.map((key) => (
            <li key={key} className="flex items-center gap-2">
              <Check aria-hidden className="size-3" />
              {tRoot(key)}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild variant={tier.popular ? "default" : "outline"} className="w-full">
          <Link href={tier.cta.href}>{tRoot(tier.cta.labelKey)}</Link>
        </Button>
      </CardFooter>
    </>
  );

  if (tier.popular) {
    return (
      <Card className="relative">
        {tier.popularLabelKey && (
          <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-linear-to-br/increasing from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-white/20 ring-offset-1 ring-offset-gray-950/5 ring-inset">
            {tRoot(tier.popularLabelKey)}
          </span>
        )}
        <div className="flex h-full flex-col">{inner}</div>
      </Card>
    );
  }

  return <Card className="flex flex-col">{inner}</Card>;
};
