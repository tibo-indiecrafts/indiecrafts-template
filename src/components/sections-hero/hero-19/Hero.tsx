import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Target } from "lucide-react";
import { Button } from "@/components/ui-primitives/grid-2-landing-button";
import { Container } from "@/components/ui-primitives/grid-2-landing-container";
import {
  FeatureCard,
  FeatureCardCIllustration,
  FeatureCardContent,
  FeatureCardDescription,
  FeatureCardTitle,
} from "@/components/ui-primitives/grid-2-landing-feature-card";
import { CampaignIllustration } from "@/components/ui-illustrations/grid-2-landing-campaign-illustration";
import { MessageIllustration } from "@/components/ui-illustrations/grid-2-landing-message-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { hero19Namespace } from "./config";
import type { HeroBlock } from "./schema";

/**
 * Grid-2 landing hero — JSX verbatim. Grid-shaped Container with
 * a masked Unsplash backdrop, centered title + body + CTA + subtext,
 * then 2 `FeatureCard` tiles in the lower bordered grid.
 */
export default function Hero(props: Readonly<HeroBlock>) {
  const [t, , tRoot] = useScopedT(hero19Namespace);
  const external = props.primary.href.startsWith("http");

  return (
    <section
      id={props.id}
      aria-labelledby={`${props.id}-heading`}
      className="overflow-hidden"
    >
      <div className="relative">
        <Container asGrid className="relative">
          <div
            aria-hidden
            className="dither-xs pointer-events-none absolute inset-0 mask-y-from-75% mask-x-from-65% mask-x-to-95% opacity-40 max-lg:opacity-20 2xl:mx-auto 2xl:max-w-7xl"
          >
            <div className="size-full">
              <Image
                src="https://raw.githubusercontent.com/tailark/assets/refs/heads/main/grid-2-bg_bqde4m.webp"
                alt=""
                className="size-full -scale-x-100 object-cover brightness-75 contrast-35"
                width={2224}
                height={1589}
                priority
                fetchPriority="high"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1520px"
              />
            </div>
          </div>

          <div aria-hidden className="col-span-full grid grid-cols-10 gap-px">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square">
                <div data-grid-content />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-10 gap-px">
            <div aria-hidden className="hidden grid-rows-4 gap-px @4xl:grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div data-grid-content />
                </div>
              ))}
            </div>

            <div className="col-span-full @4xl:col-span-8">
              <div data-grid-content className="py-12 text-center">
                <div className="relative mx-auto max-w-3xl text-center">
                  <h1
                    id={`${props.id}-heading`}
                    className="text-foreground text-5xl font-semibold text-balance md:text-6xl"
                  >
                    <span className="@max-md:hidden">
                      {tRoot(props.headline.firstAccentKey)}
                    </span>{" "}
                    {tRoot(props.headline.restKey)}
                  </h1>
                  <p className="text-muted-foreground mt-5 mb-9 text-lg text-balance">
                    {tRoot(props.bodyKey)}
                  </p>

                  <Button
                    asChild
                    size="lg"
                    className="text-sm shadow-xl shadow-indigo-900/40"
                  >
                    <Link
                      href={props.primary.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                    >
                      {tRoot(props.primary.labelKey)}
                    </Link>
                  </Button>
                  <span className="text-muted-foreground mt-3 block text-center text-sm">
                    {tRoot(props.subtextKey)}
                  </span>
                </div>
              </div>
            </div>

            <div aria-hidden className="hidden grid-rows-4 gap-px @4xl:grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div data-grid-content />
                </div>
              ))}
            </div>
          </div>

          <div aria-hidden className="col-span-full grid grid-cols-10 gap-px">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square">
                <div data-grid-content />
              </div>
            ))}
          </div>
        </Container>

        <Container asGrid className="relative shadow-indigo-900/20">
          <h2 className="sr-only">Features</h2>
          <div className="grid gap-px [--color-primary:var(--color-indigo-500)] @2xl:grid-cols-2 @4xl:grid-cols-10">
            <div className="@max-4xl:hidden">
              <div data-grid-content />
            </div>
            <div className="@4xl:col-span-4">
              <FeatureCard>
                <FeatureCardContent>
                  <FeatureCardTitle>
                    <Target className="size-4" />
                    {t("feature1.title")}
                  </FeatureCardTitle>
                  <FeatureCardDescription>
                    <span className="text-foreground">{t("feature1.boldHead")}</span>{" "}
                    {t("feature1.tail")}
                  </FeatureCardDescription>
                </FeatureCardContent>
                <FeatureCardCIllustration>
                  <CampaignIllustration />
                </FeatureCardCIllustration>
              </FeatureCard>
            </div>
            <div className="@4xl:col-span-4">
              <FeatureCard>
                <FeatureCardContent>
                  <FeatureCardTitle>
                    <MessageCircle className="size-4" />
                    {t("feature2.title")}
                  </FeatureCardTitle>
                  <FeatureCardDescription>
                    <span className="text-foreground">{t("feature2.boldHead")}</span>{" "}
                    {t("feature2.tail")}
                  </FeatureCardDescription>
                </FeatureCardContent>
                <FeatureCardCIllustration>
                  <MessageIllustration />
                </FeatureCardCIllustration>
              </FeatureCard>
            </div>
            <div className="@max-4xl:hidden">
              <div data-grid-content />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
