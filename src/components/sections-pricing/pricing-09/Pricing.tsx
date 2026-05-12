import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Firebase } from "@/components/ui-primitives/svgs/firebase";
import { useScopedT } from "@/i18n/scoped-t";
import { pricing09Namespace } from "./config";
import type { PricingBlock } from "./schema";

/**
 * Tailark `pricing-5` — JSX verbatim. Single-tier enterprise card
 * on `py-16 md:py-32` inside `max-w-5xl`. Headline above a 2-col
 * card (`md:grid-cols-2 md:divide-x md:divide-y-0`) with elevated
 * `bg-card rounded-3xl border shadow-2xl shadow-zinc-950/5` chrome.
 *  - Left (`md:pr-12 text-center`): plan title + subtitle + giant
 *    `text-6xl` price + primary CTA + "Includes" footnote
 *  - Right: 4-feature checklist + "Companies using our platform"
 *    tagline + Hulu/Spotify/Firebase wordmark row
 *
 * Sister of pricing-03 (mist-pricing-1) — same 2-col card shape but
 * elevated chrome (no `bg-muted` outer wrapper) and different brand
 * row.
 */
export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricing09Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="relative py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id={headingId}
              className="text-3xl font-bold text-balance md:text-4xl lg:text-5xl"
            >
              {tRoot(props.titleKey)}
            </h2>
          </div>
          <div className="mt-8 md:mt-20">
            <div className="bg-card relative rounded-3xl border shadow-2xl shadow-zinc-950/5">
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
                        <Check aria-hidden className="size-3" />
                        <span>{tRoot(key)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground mt-6 text-sm">
                    {tRoot(props.partnersTaglineKey)}
                  </p>
                  <div className="**:fill-foreground mt-12 flex flex-wrap items-center gap-12">
                    <Hulu height={18} width={56} />
                    <Spotify height={24} width={80} />
                    <Firebase height={24} width={80} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
