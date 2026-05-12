import { CalendarDays, Clock2, Database, Globe2, Zap } from "lucide-react";
import { Container } from "@/components/ui-effects/grid-2-landing-container";
import {
  FeatureCard,
  FeatureCardCIllustration,
  FeatureCardContent,
  FeatureCardDescription,
  FeatureCardTitle,
} from "@/components/ui-effects/grid-2-landing-feature-card";
import { MapIllustration } from "@/components/ui-illustrations/map-illustration-03";
import { VisualizationIllustration } from "@/components/ui-illustrations/visualization-illustration-04";
import { useScopedT } from "@/i18n/scoped-t";
import { features32Namespace } from "./config";
import type { Features32Block } from "./schema";

const subFeatures = [
  { icon: Clock2, key: "tile1" },
  { icon: Zap, key: "tile2" },
  { icon: CalendarDays, key: "tile3" },
  { icon: CalendarDays, key: "tile4" },
] as const;

export default function Features(props: Readonly<Features32Block>) {
  const [t] = useScopedT(features32Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="overflow-hidden">
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
            <FeatureCard>
              <FeatureCardContent>
                <FeatureCardTitle>
                  <Globe2 className="size-4" />
                  {t("card1.title")}
                </FeatureCardTitle>
                <FeatureCardDescription>
                  <span className="text-foreground">{t("card1.boldHead")}</span>{" "}
                  {t("card1.tail")}
                </FeatureCardDescription>
              </FeatureCardContent>
              <FeatureCardCIllustration className="relative px-0 @4xl:px-0">
                <div className="relative w-full self-center mask-radial-from-35% @4xl:-mx-32">
                  <MapIllustration />
                </div>
              </FeatureCardCIllustration>
            </FeatureCard>
          </div>

          <div className="@4xl:col-span-4">
            <FeatureCard>
              <FeatureCardContent>
                <FeatureCardTitle>
                  <Database className="size-4" />
                  {t("card2.title")}
                </FeatureCardTitle>
                <FeatureCardDescription>
                  <span className="text-foreground">{t("card2.boldHead")}</span>{" "}
                  {t("card2.tail")}
                </FeatureCardDescription>
              </FeatureCardContent>
              <FeatureCardCIllustration>
                <VisualizationIllustration />
              </FeatureCardCIllustration>
            </FeatureCard>
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
