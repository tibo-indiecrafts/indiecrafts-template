import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Button } from "@/components/ui-primitives/grid-2-solution-button";
import {
  Container,
  Separator,
} from "@/components/ui-primitives/grid-2-solution-container";
import { Beacon } from "@/components/ui-primitives/svgs/grid-2-solution-beacon";
import { Stripe } from "@/components/ui-primitives/svgs/grid-2-solution-stripe";
import { Tailwindcss as TailwindCSS } from "@/components/ui-primitives/svgs/grid-2-solution-tailwindcss";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/grid-2-solution-vercel";
import { CollaborationSection } from "./sections/collaboration-section";
import { SecurityFeatures } from "./sections/security-features";
import MoreFeatures from "./sections/more-features";
import { TestimonialsSection } from "./sections/testimonials-section";
import { CallToAction } from "./sections/call-to-action";
import { EnterpriseForm } from "./sections/enterprise-form";
import { solutions01Defaults, solutions01Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Tailark Pro `grid-2-solution-one` faithful port. Enterprise
 * invoicing solutions page with form-driven hero. Sub-sections
 * (collaboration, security, more-features, testimonials, cta) +
 * the `EnterpriseForm` live as page-local components under
 * `./sections/`. `pt-14` clears the fixed `Header10`.
 */
export function Landing({
  layout = solutions01Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(solutions01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out as visible 1px hairlines. `pt-14`
          clears the fixed `Header10` (h-14). */}
      <div className="bg-foreground/10 pt-14">
        <section id={solutions01Defaults.sectionIds.hero} className="overflow-hidden">
          <div className="relative">
            <Container className="px-6 py-3 @4xl:px-12">
              <span className="text-muted-foreground font-mono text-sm uppercase">
                Enterprise
              </span>
            </Container>
            <Container asGrid>
              <div className="grid gap-px @4xl:grid-cols-2">
                <div data-grid-content className="p-6 @4xl:p-12">
                  <div className="relative mx-auto max-w-3xl @max-4xl:text-center">
                    <h2 className="text-foreground text-5xl font-semibold tracking-tight text-balance lg:text-6xl">
                      {t("title")}
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-6 mb-8 text-lg text-balance">
                      Our Enterprise Invoicing solution simplifies billing processes,
                      enhances financial oversight, and ensures compliance with ease.
                    </p>

                    <Button asChild size="lg">
                      <Link href="#link">Watch demo</Link>
                    </Button>

                    <ul className="mt-8 space-y-2">
                      {["Create invoices", "Track payments", "Manage finances"].map(
                        (item, index) => (
                          <li
                            key={index}
                            className="text-muted-foreground flex items-center gap-2 @max-4xl:justify-center"
                          >
                            <CheckCircle2 className="size-4 fill-emerald-400/25 text-emerald-600 dark:text-emerald-500" />
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>

                <div data-grid-content className="bg-card/80! p-6 @4xl:p-12">
                  <EnterpriseForm />
                </div>
              </div>
            </Container>

            <Container
              asGrid
              className="grid grid-cols-2 gap-px p-[0.5px] **:data-grid-content:p-6 @4xl:grid-cols-4 @4xl:**:data-grid-content:p-12 @5xl:**:data-grid-content:p-12"
            >
              <div data-grid-content className="row-span-2 grid grid-rows-subgrid gap-6">
                <p className="text-muted-foreground text-balance">
                  <strong className="text-foreground font-medium">
                    99.9% Uptime guarantee
                  </strong>{" "}
                  ensured across all platforms.
                </p>

                <Stripe height={22} width={56} />
              </div>
              <div data-grid-content className="row-span-2 grid grid-rows-subgrid gap-6">
                <p className="text-muted-foreground text-balance">
                  <strong className="text-foreground font-medium">15X</strong> faster
                  deployment daily speed.
                </p>

                <TailwindCSS height={24} width={120} />
              </div>
              <div data-grid-content className="row-span-2 grid grid-rows-subgrid gap-6">
                <p className="text-muted-foreground">
                  <strong className="text-foreground font-medium">24/7 Support</strong>{" "}
                  with dedicated teams.
                </p>

                <Beacon height={22} width={68} />
              </div>
              <div data-grid-content className="row-span-2 grid grid-rows-subgrid gap-6">
                <p className="text-muted-foreground text-balance">
                  <strong className="text-foreground font-medium">
                    Seamless Integration
                  </strong>{" "}
                  with top industry tools.
                </p>

                <VercelFull height={24} width={78} />
              </div>
            </Container>
          </div>
        </section>
        <Separator className="h-32" />
        <CollaborationSection />
        <Separator className="h-24" />

        <SecurityFeatures />
        <Separator className="h-24" />

        <MoreFeatures />
        <TestimonialsSection />
        <CallToAction />
      </div>
    </Layout>
  );
}
