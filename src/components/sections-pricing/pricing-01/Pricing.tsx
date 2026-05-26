import { Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui-primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui-primitives/card";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { pricing01Namespace } from "./config";
import type { PricingBlock } from "./schema";

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, tr, tRoot] = useScopedT(pricing01Namespace);

  return (
    <section aria-labelledby={`${props.id}-title`} className="border-b py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-(--gutter)">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 id={`${props.id}-title`} className="text-4xl font-semibold lg:text-5xl">
            {tr(props.titleKey, "title")}
          </h2>
          {props.bodyKey ? (
            <p className="text-muted-foreground">{tr(props.bodyKey, "body")}</p>
          ) : null}
        </div>

        <ul className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          {props.tiers.map((tier) => (
            <li key={tier.id}>
              <Card
                className={cn(
                  "relative flex h-full flex-col",
                  tier.badgeKey && "ring-brand/60 ring-2",
                )}
              >
                {tier.badgeKey ? (
                  <span className="bg-brand text-brand-foreground absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium shadow">
                    {tRoot(tier.badgeKey)}
                  </span>
                ) : null}
                <CardHeader>
                  <CardTitle className="font-medium">{tRoot(tier.nameKey)}</CardTitle>
                  <span className="my-3 block text-2xl font-semibold">
                    {tRoot(tier.priceKey)}
                    {tier.periodKey ? (
                      <span className="text-muted-foreground ml-1 text-base font-normal">
                        {tRoot(tier.periodKey)}
                      </span>
                    ) : null}
                  </span>
                  {tier.descriptionKey ? (
                    <CardDescription className="text-sm">
                      {tRoot(tier.descriptionKey)}
                    </CardDescription>
                  ) : null}
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <Link href={tier.cta.href}>{tRoot(tier.cta.labelKey)}</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <hr className="border-dashed" />
                  <ul className="space-y-3 text-sm">
                    {tier.featureKeys.map((key, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="text-brand size-3" aria-hidden="true" />
                        <span>{tRoot(key)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
