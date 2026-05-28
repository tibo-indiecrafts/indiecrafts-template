import { useTranslations } from "next-intl";
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
import { cn } from "@/lib/utils";
import type { StaticAppPathname } from "@/config";

export type PricingTier = {
  /** Maps to `<namespace>.tiers.<id>.*` in messages. */
  id: string;
  cta: { href: StaticAppPathname };
  /** Feature ids — keys are read as `tiers.<tier>.features.<feature>`. */
  featureIds: readonly string[];
  /** Renders the tier with a highlighted ring + the `<id>.badge` copy. */
  highlighted?: boolean;
};

export type PricingBlock = {
  type: "pricing";
  id: string;
  /** i18n namespace — e.g. `"pages.home.blocks.pricing"`. */
  namespace: string;
  tiers: readonly PricingTier[];
};

export function Pricing(props: Readonly<PricingBlock>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(props.namespace as any);

  return (
    <section aria-labelledby={`${props.id}-title`} className="border-b py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-(--gutter)">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 id={`${props.id}-title`} className="text-4xl font-semibold lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">{t("body")}</p>
        </div>

        <ul className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          {props.tiers.map((tier) => {
            const k = (suffix: string) => `tiers.${tier.id}.${suffix}`;
            return (
              <li key={tier.id}>
                <Card
                  className={cn(
                    "relative flex h-full flex-col",
                    tier.highlighted && "ring-brand/60 ring-2",
                  )}
                >
                  {tier.highlighted ? (
                    <span className="bg-brand text-brand-foreground absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium shadow">
                      {t(k("badge"))}
                    </span>
                  ) : null}
                  <CardHeader>
                    <CardTitle className="font-medium">{t(k("name"))}</CardTitle>
                    <span className="my-3 block text-2xl font-semibold">
                      {t(k("price"))}
                      <span className="text-muted-foreground ml-1 text-base font-normal">
                        {t(k("period"))}
                      </span>
                    </span>
                    <CardDescription className="text-sm">
                      {t(k("description"))}
                    </CardDescription>
                    <Button asChild variant="outline" className="mt-4 w-full">
                      <Link href={tier.cta.href}>{t(k("cta"))}</Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <hr className="border-dashed" />
                    <ul className="space-y-3 text-sm">
                      {tier.featureIds.map((fid) => (
                        <li key={fid} className="flex items-center gap-2">
                          <Check className="text-brand size-3" aria-hidden="true" />
                          <span>{t(k(`features.${fid}`))}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
