import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AtSign, Brain } from "lucide-react";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Button } from "@/components/ui-effects/grid-2-product-two-button";
import {
  Container,
  Separator,
} from "@/components/ui-effects/grid-2-product-two-container";
import {
  FeatureCard,
  FeatureCardCIllustration,
  FeatureCardContent,
  FeatureCardDescription,
  FeatureCardTitle,
} from "@/components/ui-effects/grid-2-product-two-feature-card";
import AiAutocompleteIllustration from "@/components/ui-illustrations/grid-2-product-two-ai-autocomplete";
import { AiMentionsIllustration } from "@/components/ui-illustrations/grid-2-product-two-ai-mentions";
import { LogoCloud } from "./sections/logo-cloud";
import HowItWorksSection from "./sections/how-it-works";
import { TestimonialSection } from "./sections/testimonial";
import { ExpandableFeatures } from "./sections/expandable-features";
import { NotesFeatures } from "./sections/notes-features";
import { ProductIllustration } from "./sections/product-illustration";
import { TestimonialsSection } from "./sections/testimonials-section";
import { CallToAction } from "./sections/call-to-action";
import { product02Defaults, product02Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Landing({
  layout = product02Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(product02Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out as visible 1px hairlines (mirrors
          upstream's `bg-zinc-950/10` main wrapper). `pt-14` clears
          the fixed `Header10` (h-14) so the "Invoicing" eyebrow
          isn't hidden behind the navbar. */}
      <div className="bg-foreground/10 pt-14">
        <section id={product02Defaults.sectionIds.hero} className="overflow-hidden">
          <div className="relative">
            <Container className="px-6 py-3 text-center @4xl:px-12">
              <span className="text-muted-foreground font-mono text-sm uppercase">
                Invoicing
              </span>
            </Container>
            <Container asGrid>
              <div className="grid grid-cols-10 gap-px">
                <div aria-hidden className="max-sm:hidden">
                  <div data-grid-content />
                </div>

                <div className="col-span-full sm:col-span-8">
                  <div data-grid-content className="px-6 pt-12 pb-16 text-center">
                    <div className="relative mx-auto max-w-3xl text-center">
                      <h2 className="text-foreground text-5xl font-semibold tracking-tight text-balance lg:text-6xl">
                        {t("title")}
                      </h2>
                      <p className="text-muted-foreground mx-auto mt-6 mb-8 text-lg text-balance">
                        Our Enterprise Invoicing solution simplifies billing processes,
                        enhances financial oversight, and ensures compliance with ease.
                      </p>

                      <Button
                        asChild
                        size="lg"
                        className="text-sm shadow-xl shadow-indigo-900/40"
                      >
                        <Link href="#">Start Testing for free</Link>
                      </Button>
                      <span className="text-muted-foreground mt-3 block text-center text-sm">
                        No credit card required!
                      </span>
                    </div>
                  </div>
                </div>

                <div aria-hidden className="max-sm:hidden">
                  <div data-grid-content />
                </div>
              </div>
            </Container>
            <div className="relative">
              <div className="absolute inset-0 grid grid-rows-[auto_1fr]">
                <Container asGrid decorators={6}>
                  <div aria-hidden className="col-span-full grid grid-cols-10 gap-px">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1"
                      >
                        <div data-grid-content />
                      </div>
                    ))}
                  </div>
                  <div aria-hidden className="col-span-full grid grid-cols-10 gap-px">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square odd:rounded odd:bg-indigo-200 even:col-span-2 even:aspect-2/1"
                      >
                        <div data-grid-content />
                      </div>
                    ))}
                  </div>
                  <div aria-hidden className="col-span-full grid grid-cols-10 gap-px">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1"
                      >
                        <div data-grid-content />
                      </div>
                    ))}
                  </div>
                </Container>

                <Container aria-hidden decorators={6}>
                  <></>
                </Container>
              </div>
              <div className="-translate-y-6">
                <ProductIllustration />
              </div>
            </div>
          </div>
          <LogoCloud />
        </section>
        <Separator className="h-24" />

        <Container asGrid className="relative">
          <h2 className="sr-only">Features</h2>
          <div className="grid gap-px [--color-primary:var(--color-indigo-500)] @2xl:grid-cols-2 @4xl:grid-cols-10">
            <div className="@max-4xl:hidden">
              <div data-grid-content />
            </div>
            <div className="@4xl:col-span-4">
              <FeatureCard>
                <FeatureCardContent>
                  <FeatureCardTitle>
                    <Brain className="size-4" />
                    AI Autocomplete
                  </FeatureCardTitle>
                  <FeatureCardDescription>
                    <span className="text-foreground">
                      Get intelligent suggestions as you type.
                    </span>{" "}
                    Context-aware completions that understand your intent.
                  </FeatureCardDescription>
                </FeatureCardContent>
                <FeatureCardCIllustration>
                  <AiAutocompleteIllustration />
                </FeatureCardCIllustration>
              </FeatureCard>
            </div>
            <div className="@4xl:col-span-4">
              <FeatureCard>
                <FeatureCardContent>
                  <FeatureCardTitle>
                    <AtSign className="size-4" />
                    Contextual Mentions
                  </FeatureCardTitle>
                  <FeatureCardDescription>
                    <span className="text-foreground">
                      Reference any file with a simple @mention.
                    </span>{" "}
                    Pull in context from all documents instantly.
                  </FeatureCardDescription>
                </FeatureCardContent>
                <FeatureCardCIllustration>
                  <AiMentionsIllustration />
                </FeatureCardCIllustration>
              </FeatureCard>
            </div>
            <div className="@max-4xl:hidden">
              <div data-grid-content />
            </div>
          </div>
        </Container>
        <Separator className="h-24" />

        <HowItWorksSection />
        <Separator className="h-24" />
        <TestimonialSection />
        <Separator className="h-24" />
        <ExpandableFeatures />
        <NotesFeatures />
        <TestimonialsSection />
        <CallToAction />
      </div>
    </Layout>
  );
}
