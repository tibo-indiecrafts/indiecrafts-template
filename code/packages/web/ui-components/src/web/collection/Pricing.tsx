import type { PricingModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@indiecrafts/packages-web-ui/web/card";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { RichTitle } from "../RichTitle";
import { ModuleSection } from "../layout/ModuleSection";
import { ModuleCta } from "../layout/Cta";

/**
 * Pricing — a title/intro over a row of plan cards. A highlighted tier gets the
 * brand ring + its badge. Each tier lists its features with a check, and a
 * full-width CTA. Renders nothing with no tiers.
 */
export function Pricing({
  inline,
  ...props
}: PricingModule & { inline?: boolean }) {
  const tiers = props.tiers ?? [];
  if (!tiers.length) return null;
  return (
    <ModuleSection anchor={props.anchor} inline={inline}>
      {props.title || props.intro ? (
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          {props.title ? (
            <RichTitle as="h2" className="text-3xl font-semibold lg:text-4xl">
              {props.title}
            </RichTitle>
          ) : null}
          {props.intro ? (
            <p className="text-muted-foreground">{props.intro}</p>
          ) : null}
        </div>
      ) : null}
      <ul className="mt-8 grid gap-6 md:mt-16 md:grid-cols-3">
        {tiers.map((tier) => (
          <li key={tier._key}>
            <Card
              className={cn(
                "relative flex h-full flex-col",
                tier.highlighted && "ring-brand/60 ring-2",
              )}
            >
              {tier.highlighted && tier.badge ? (
                <span className="bg-brand text-brand-foreground absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium shadow">
                  {tier.badge}
                </span>
              ) : null}
              <CardHeader>
                <CardTitle className="font-medium">{tier.name}</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  {tier.price}
                  {tier.period ? (
                    <span className="text-muted-foreground ml-1 text-base font-normal">
                      {tier.period}
                    </span>
                  ) : null}
                </span>
                {tier.description ? (
                  <CardDescription className="text-sm">
                    {tier.description}
                  </CardDescription>
                ) : null}
                {tier.cta ? (
                  <div className="mt-4">
                    <ModuleCta
                      cta={tier.cta}
                      className="w-full justify-center"
                    />
                  </div>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="space-y-3 text-sm">
                  {(tier.features ?? []).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="text-brand size-3" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </ModuleSection>
  );
}
