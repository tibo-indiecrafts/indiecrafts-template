import Link from "next/link";
import { CalendarDays, Check, Clock2, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui-primitives/grid-2-landing-button";
import { Container } from "@/components/ui-primitives/grid-2-landing-container";
import {
  FeatureCard,
  FeatureCardContent,
} from "@/components/ui-primitives/grid-2-landing-feature-card";
import { EnterpriseMessageIllustration } from "@/components/ui-illustrations/grid-2-landing-enterprise-message-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { features33Namespace } from "./config";
import type { Features33Block } from "./schema";

const subFeatures = [
  { icon: Clock2, key: "tile1" },
  { icon: Zap, key: "tile2" },
  { icon: CalendarDays, key: "tile3" },
  { icon: CalendarDays, key: "tile4" },
] as const;

export default function Features(props: Readonly<Features33Block>) {
  const [t] = useScopedT(features33Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <Container className="py-16 lg:py-24">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2
            id={`${props.id}-heading`}
            className="text-foreground text-4xl font-semibold text-balance lg:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg text-balance">{t("body")}</p>
        </div>
      </Container>
      <Container asGrid>
        <div className="grid gap-px @2xl:grid-cols-2 @4xl:grid-cols-10">
          <div aria-hidden className="@max-4xl:hidden">
            <div data-grid-content />
          </div>
          <div className="@4xl:col-span-4">
            <FeatureCard className="col-span-full grid-rows-1 @4xl:col-span-2">
              <FeatureCardContent className="flex h-full flex-col space-y-6 @4xl:pb-12">
                <div className="bg-card ring-foreground/3 flex size-12 rounded-full shadow-xl ring-1 shadow-black/5">
                  <TrendingUp className="text-muted-foreground m-auto size-4" />
                </div>
                <h3 className="text-3xl font-semibold">{t("card.title")}</h3>
                <p className="text-muted-foreground text-balance">{t("card.body")}</p>
                <ul className="w-full space-y-2">
                  {[t("card.bullet1"), t("card.bullet2"), t("card.bullet3")].map(
                    (feature, index) => (
                      <li
                        key={index}
                        className="text-muted-foreground flex items-center gap-2"
                      >
                        <Check className="size-4 text-emerald-500" />
                        {feature}
                      </li>
                    ),
                  )}
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
                  <Link href="#">{t("card.cta")}</Link>
                </Button>
              </FeatureCardContent>
            </FeatureCard>
          </div>
          <div className="@4xl:col-span-4">
            <EnterpriseMessageIllustration />
          </div>
          <div aria-hidden className="@max-4xl:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
      <Container
        asGrid
        className="grid-cols-2 **:data-grid-content:p-6 @4xl:grid-cols-10 @4xl:**:data-grid-content:p-8 @5xl:**:data-grid-content:p-12"
      >
        <div aria-hidden className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
        <div className="col-span-8 grid gap-px @sm:grid-cols-2 @4xl:grid-cols-3">
          {subFeatures.map((feature, index) => (
            <div key={index} className="@4xl:last:hidden">
              <div data-grid-content className="space-y-3">
                <feature.icon className="size-4" />
                <h3 className="mt-3 font-medium">
                  {t(`subFeatures.${feature.key}.title`)}
                </h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {t(`subFeatures.${feature.key}.body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div aria-hidden className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
      </Container>
    </section>
  );
}
