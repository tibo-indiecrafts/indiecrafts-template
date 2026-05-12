import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { AtSign, Brain, Search } from "lucide-react";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Button } from "@/components/ui-primitives/grid-2-product-button";
import {
  Container,
  Separator,
} from "@/components/ui-primitives/grid-2-product-container";
import {
  FeatureCard,
  FeatureCardCIllustration,
  FeatureCardContent,
  FeatureCardDescription,
  FeatureCardTitle,
} from "@/components/ui-primitives/grid-2-product-feature-card";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/grid-2-product-ai-autocomplete";
import { AiMentionsIllustration } from "@/components/ui-illustrations/grid-2-product-ai-mentions";
import { SearchResultsIllustration } from "@/components/ui-illustrations/grid-2-product-search-results-illustration";
import { LogoCloud } from "./sections/logo-cloud";
import HowItWorksSection from "./sections/how-it-works";
import { TestimonialSection } from "./sections/testimonial";
import { ExpandableFeatures } from "./sections/expandable-features";
import { PipelineFeatures } from "./sections/pipeline-features";
import { TestimonialsSection } from "./sections/testimonials-section";
import { CallToAction } from "./sections/call-to-action";
import { product01Defaults, product01Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Tailark Pro `grid-2-product-one` faithful port. The hero is a
 * complex grid composition (search bar + masked Unsplash backdrop +
 * 2 AI feature cards) that's inlined here verbatim. Sub-sections
 * live in `./sections/` — they're page-local since they're tightly
 * coupled to the product page-template and don't share a bucket
 * pattern with other variants. Strings are minimally extracted (the
 * h1 / body / CTA / subtext live in i18n; deeper content stays
 * verbatim per upstream).
 */
export function Landing({
  layout = product01Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(product01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out as visible 1px hairlines (mirrors
          upstream's `bg-zinc-950/10` main wrapper). `pt-14` clears
          the fixed `Header10` (h-14) so the page's first row isn't
          hidden behind the navbar. */}
      <div className="bg-foreground/10 pt-14">
        <section id={product01Defaults.sectionIds.hero} className="overflow-hidden">
          <div className="relative">
            <Container asGrid className="relative">
              <div
                aria-hidden
                className="dither-xs pointer-events-none absolute inset-0 z-1 mask-y-from-75% mask-x-from-65% mask-x-to-95% opacity-25 2xl:mx-auto 2xl:max-w-7xl"
              >
                <div className="size-full">
                  <Image
                    src="https://images.unsplash.com/photo-1769174900856-d7e38598786a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="size-full object-cover object-bottom brightness-75 contrast-35"
                    width={2224}
                    height={1589}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1520px"
                  />
                </div>
              </div>

              <div className="col-span-full grid grid-cols-10 gap-px">
                <div
                  aria-hidden
                  className="grid grid-cols-2 gap-px @4xl:col-span-3 @4xl:grid-cols-3"
                >
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="max-h-64 last:col-span-1 @4xl:aspect-square @4xl:max-h-full @4xl:last:col-span-2 @4xl:last:aspect-2/1"
                    >
                      <div data-grid-content />
                    </div>
                  ))}
                </div>
                <div className="col-span-8 grid-cols-8 @4xl:col-span-4">
                  <div data-grid-content className="grid grid-rows-[1fr_auto]">
                    <div className="mx-6 border-b @max-3xl:hidden" />
                    <div className="p-2 md:p-6">
                      <div className="mx-auto flex h-10 w-fit items-center gap-2 rounded-full border px-3 @4xl:w-full">
                        <Search className="size-4" />
                        <span className="text-muted-foreground line-clamp-1 text-sm">
                          Best illustrations for our{" "}
                          <span className="relative">
                            <span className="text-foreground">Marketing website</span>
                            <span className="absolute inset-0 -translate-y-0.5 bg-linear-to-r/longer from-emerald-300 via-purple-400 to-indigo-500 bg-clip-text text-transparent blur-xs">
                              Marketing website
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  aria-hidden
                  className="grid grid-cols-2 gap-px @4xl:col-span-3 @4xl:grid-cols-3"
                >
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="max-h-64 last:col-span-1 @4xl:aspect-square @4xl:max-h-full @4xl:first:col-span-2 @4xl:first:aspect-2/1"
                    >
                      <div data-grid-content />
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative space-y-px">
                <div className="absolute inset-0 mx-auto max-w-3xl pt-6 @max-5xl:origin-top @max-5xl:scale-95">
                  <div className="relative z-10 mx-auto max-w-xl">
                    <SearchResultsIllustration />

                    <div className="mt-4 flex items-center justify-between px-6 text-xs">
                      <div className="text-muted-foreground">3 suggestions</div>
                      <div className="text-muted-foreground flex items-center gap-1">
                        <span className="bg-background ring-border-illustration rounded px-1 ring-1">
                          ↑
                        </span>
                        <span className="bg-background ring-border-illustration rounded px-1 ring-1">
                          ↓
                        </span>
                        to navigate
                      </div>
                    </div>
                  </div>
                </div>

                <div aria-hidden className="col-span-full grid grid-cols-10 gap-px">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square first:col-span-2 first:aspect-2/1 last:col-span-2 last:aspect-2/1 nth-3:col-span-2 nth-3:aspect-2/1 nth-4:col-span-2 nth-4:aspect-2/1"
                    >
                      <div data-grid-content />
                    </div>
                  ))}
                </div>

                <div aria-hidden className="col-span-full grid grid-cols-10 gap-px">
                  <div className="aspect-square">
                    <div data-grid-content />
                  </div>
                  <div className="col-span-5">
                    <div data-grid-content />
                  </div>
                  <div className="col-span-4 grid grid-cols-4 gap-px">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-square">
                        <div data-grid-content />
                      </div>
                    ))}
                  </div>
                </div>

                <div aria-hidden className="col-span-full grid grid-cols-10 gap-px">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square first:col-span-2 first:aspect-2/1 last:col-span-2 last:aspect-2/1 nth-4:col-span-2 nth-4:aspect-2/1"
                    >
                      <div data-grid-content />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-10 gap-px">
                <div className="@max-2xl:hidden">
                  <div data-grid-content />
                </div>

                <div className="col-span-8 @max-2xl:col-span-full">
                  <div data-grid-content className="py-12 text-center">
                    <div className="relative z-10 mx-auto max-w-3xl text-center @max-4xl:pt-24 @max-2xl:pt-44">
                      <h2 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
                        {t("title")}
                      </h2>
                      <p className="text-muted-foreground mx-auto mt-5 mb-9 max-w-xl text-lg text-balance">
                        With Tailark&apos;s personal AI, get your projects to the finish
                        line faster and with context.
                      </p>

                      <Button
                        asChild
                        size="lg"
                        className="text-sm shadow-xl shadow-indigo-900/40"
                      >
                        <Link href="#">Get Started</Link>
                      </Button>
                      <span className="text-muted-foreground mt-3 block text-center text-sm">
                        No credit card required!
                      </span>
                    </div>
                  </div>
                </div>

                <div className="@max-2xl:hidden">
                  <div data-grid-content />
                </div>
              </div>
            </Container>

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
          </div>
          <LogoCloud />
        </section>
        <Separator className="h-24" />
        <HowItWorksSection />
        <Separator className="h-24" />
        <TestimonialSection />
        <Separator className="h-24" />
        <ExpandableFeatures />
        <PipelineFeatures />
        <TestimonialsSection />
        <CallToAction />
      </div>
    </Layout>
  );
}
