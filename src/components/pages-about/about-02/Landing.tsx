import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Container, Separator } from "@/components/ui-primitives/grid-2-about-container";
import { MissionSection } from "./sections/mission-section";
import { CoreValuesSection } from "./sections/core-values-section";
import { TeamSection } from "./sections/team-section";
import { InvestorsSection } from "./sections/investors-section";
import { HiringSection } from "./sections/hiring-section";
import { about02Defaults, about02Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Landing({
  layout = about02Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(about02Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out. `pt-14` clears the fixed `Header10`. */}
      <div className="bg-foreground/10 pt-14">
        <section id={about02Defaults.sectionIds.hero} className="overflow-hidden">
          <Container asGrid>
            <div className="grid grid-cols-10 gap-px">
              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>

              <div
                data-grid-content
                className="col-span-full p-6 sm:col-span-8 @4xl:p-12"
              >
                <span className="text-muted-foreground text-sm font-medium">
                  About us
                </span>
                <h2 className="text-foreground mt-12 text-5xl font-semibold tracking-tight text-balance lg:text-6xl">
                  {t("title")}
                </h2>
                <p className="text-muted-foreground mt-6 max-w-2xl text-lg text-balance">
                  Founded in 2023, Acme started with a simple belief: developer tools
                  should be beautiful, fast, and easy to use. Today, we serve thousands of
                  teams worldwide.
                </p>
              </div>

              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>
            </div>
          </Container>

          <Container
            asGrid
            className="grid gap-px p-[0.5px] **:data-grid-content:p-6 @xl:grid-cols-2 @4xl:grid-cols-10 @4xl:**:data-grid-content:p-12"
          >
            <div aria-hidden data-grid-content className="@max-4xl:hidden">
              <div />
            </div>
            <div data-grid-content className="@4xl:col-span-4">
              <p className="text-muted-foreground">
                <strong className="text-foreground font-medium">50,000+</strong>{" "}
                developers building with our tools.
              </p>
            </div>
            <div data-grid-content className="@4xl:col-span-4">
              <p className="text-muted-foreground">
                <strong className="text-foreground font-medium">120+</strong> countries
                with active users.
              </p>
            </div>
            <div aria-hidden data-grid-content className="@max-4xl:hidden">
              <div />
            </div>
          </Container>
          <Container>
            <div data-grid-content>
              <div className="aspect-43/24 mix-blend-darken">
                <Image
                  src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/team-hand-drawn_ctvx7q.png"
                  alt=""
                  width={1376}
                  height={768}
                />
              </div>
            </div>
          </Container>
        </section>

        <Separator />
        <MissionSection />
        <Separator />
        <CoreValuesSection />
        <Separator />
        <TeamSection />
        <Separator />
        <InvestorsSection />
        <Separator />
        <HiringSection />
      </div>
    </Layout>
  );
}
