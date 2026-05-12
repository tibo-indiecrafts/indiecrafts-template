import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { pricing03Namespace } from "./config";
import type { PricingBlock } from "./schema";

/** Plain card chrome — no baked padding/flex/gap so the upstream's
 *  `grid divide-x divide-y` layout applies cleanly. */
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricing03Namespace);
  const headingId = `${props.id}-heading`;

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
            <p className="text-muted-foreground mx-auto mt-4 max-w-md text-lg text-balance">
              {tRoot(props.bodyKey)}
            </p>
          </div>
          <div className="mt-8 md:mt-16">
            <Card className="relative">
              <div className="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
                <div className="pb-12 text-center md:pr-12 md:pb-0">
                  <h3 className="text-2xl font-semibold">{tRoot(props.planTitleKey)}</h3>
                  <p className="mt-2 text-lg">{tRoot(props.planSubtitleKey)}</p>
                  <span className="mt-12 mb-6 inline-block text-6xl font-bold">
                    <span className="text-4xl">{tRoot(props.priceCurrencyKey)}</span>
                    {tRoot(props.priceAmountKey)}
                  </span>

                  <div className="flex justify-center">
                    <Button asChild size="lg">
                      <Link href={props.cta.href}>{tRoot(props.cta.labelKey)}</Link>
                    </Button>
                  </div>

                  <p className="text-muted-foreground mt-12 text-sm">
                    {tRoot(props.includesKey)}
                  </p>
                </div>
                <div className="relative">
                  <ul className="space-y-4">
                    {props.featureKeys.map((key) => (
                      <li key={key} className="flex items-center gap-2">
                        <Check
                          aria-hidden
                          className="text-primary size-3"
                          strokeWidth={3.5}
                        />
                        <span>{tRoot(key)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground mt-6 text-sm">
                    {tRoot(props.partnersTaglineKey)}
                  </p>
                  <div className="**:fill-foreground mt-6 flex items-center gap-8">
                    <VercelFull height={20} width={76} />
                    <Spotify height={22} width={73} />
                    <Supabase className="h-[22px]" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
