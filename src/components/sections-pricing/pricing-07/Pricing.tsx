import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { pricing07Namespace } from "./config";
import type { PricingBlock, PricingTier } from "./schema";

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricing07Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 id={headingId} className="text-center text-4xl font-semibold lg:text-5xl">
            {tRoot(props.titleKey)}
          </h2>
          <p>{tRoot(props.bodyKey)}</p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
          <div className="flex flex-col justify-between space-y-8 rounded-(--radius) border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
            <div className="space-y-4">
              <BasicHeader tier={props.basic} tRoot={tRoot} />
              <Button asChild variant="outline" className="w-full">
                <Link href={props.basic.cta.href}>{tRoot(props.basic.cta.labelKey)}</Link>
              </Button>
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {props.basic.featureKeys.map((key) => (
                  <li key={key} className="flex items-center gap-2">
                    <Check aria-hidden className="size-3" />
                    {tRoot(key)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="dark:bg-muted rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <BasicHeader tier={props.pro} tRoot={tRoot} />
                <Button asChild className="w-full">
                  <Link href={props.pro.cta.href}>{tRoot(props.pro.cta.labelKey)}</Link>
                </Button>
              </div>

              <div>
                <div className="text-sm font-medium">
                  {tRoot(props.proFeaturesIntroKey)}
                </div>
                <ul className="mt-4 list-outside space-y-3 text-sm">
                  {props.pro.featureKeys.map((key) => (
                    <li key={key} className="flex items-center gap-2">
                      <Check aria-hidden className="size-3" />
                      {tRoot(key)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const BasicHeader = ({
  tier,
  tRoot,
}: {
  tier: PricingTier;
  tRoot: (key: PricingTier["nameKey"]) => string;
}) => (
  <div>
    <h3 className="font-medium">{tRoot(tier.nameKey)}</h3>
    <span className="my-3 block text-2xl font-semibold">{tRoot(tier.priceKey)}</span>
    <p className="text-muted-foreground text-sm">{tRoot(tier.cadenceKey)}</p>
  </div>
);
