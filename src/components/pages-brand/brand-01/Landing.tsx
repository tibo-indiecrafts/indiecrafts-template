import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Button } from "@/components/ui-primitives/grid-2-brand-button";
import { Container, Separator } from "@/components/ui-primitives/grid-2-brand-container";
import { ColorCard } from "./sections/color-card";
import { DownloadableLogoCard } from "./sections/downloadable-logo-card";
import { brand01Defaults, brand01Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/** Tailark Pro `grid-2-brand-one` faithful port. */
export function Landing({
  layout = brand01Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(brand01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* `pt-14` clears the fixed `Header10`. Background is plain
          theme-aware (white in light mode); brand-kit pages stay
          clean rather than tinting the page for grid-line contrast. */}
      <div className="bg-background pt-14">
        <section id={brand01Defaults.sectionIds.hero} className="overflow-hidden">
          <Container asGrid>
            <div className="grid grid-cols-10 gap-px">
              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>

              <div
                data-grid-content
                className="col-span-full p-6 sm:col-span-8 @4xl:p-12"
              >
                <h2 className="text-foreground text-5xl font-semibold tracking-tight text-balance lg:text-6xl">
                  {t("title")}
                </h2>
                <p className="text-muted-foreground mx-auto mt-4 mb-6 text-lg text-balance">
                  Guidelines and assets for presenting the Tailark brand consistently.
                </p>
                <Button asChild>
                  <Link href="#">Download all assets</Link>
                </Button>
              </div>

              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>
            </div>
          </Container>
          <Container asGrid>
            <div className="grid grid-cols-10 gap-px">
              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>

              <div className="col-span-full sm:col-span-8">
                <div data-grid-content className="p-6 @4xl:p-12">
                  <h2 className="text-muted-foreground text-balance">Naming</h2>
                  <p className="text-muted-foreground mt-6 text-xl font-medium text-balance">
                    <span className="text-foreground">&ldquo;Tailark&rdquo;</span> is
                    always written as a single word with a capital{" "}
                    <span className="text-foreground">&ldquo;T&rdquo;</span>. Do not spell
                    it as <span className="text-foreground">&ldquo;TailArk&rdquo;</span>,{" "}
                    <span className="text-foreground">&ldquo;tailark&rdquo;</span>,{" "}
                    <span className="text-foreground">&ldquo;TAILARK&rdquo;</span>, or any
                    other variation to ensure a unified identity across all touchpoints.
                  </p>
                </div>
              </div>

              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>
            </div>
          </Container>
        </section>
        <Separator />
        <section>
          <Container asGrid>
            <div className="grid grid-cols-10 gap-px">
              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>

              <div className="col-span-full grid grid-cols-2 gap-px sm:col-span-8 @xl:grid-cols-4">
                <div data-grid-content className="col-span-full p-6 @4xl:p-12">
                  <h2 className="text-muted-foreground text-balance">Colors</h2>
                  <p className="text-foreground mt-6 text-xl font-medium text-balance">
                    Our palette is designed to work seamlessly on both light and dark
                    backgrounds. The primary brand color anchors the identity, while the
                    supporting accents provide flexibility for illustrations, UI elements,
                    and print.
                  </p>
                </div>

                <ColorCard name="White" hex="#FFFFFF" className="text-foreground" />
                <ColorCard name="Dark" hex="#1F1F1F" className="text-white" />
                <ColorCard name="Iris" hex="#9B99FE" className="text-white" />
                <ColorCard name="Teal" hex="#2BC8B7" className="text-white" />
              </div>

              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>
            </div>
          </Container>
        </section>

        <Separator />
        <section>
          <Container asGrid>
            <div className="grid grid-cols-10 gap-px">
              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>

              <div className="col-span-full grid gap-px sm:col-span-8 @4xl:grid-cols-2">
                <div data-grid-content className="col-span-full p-6 @4xl:p-12">
                  <h2 className="text-muted-foreground text-balance">Logo</h2>
                  <p className="text-foreground mt-6 text-xl font-medium text-balance">
                    When space is limited, the standalone symbol can represent the brand
                    on its own. Reserve it for contexts where the audience is already
                    familiar with the brand, such as app icons, favicons, and social
                    avatars.
                  </p>
                </div>

                <DownloadableLogoCard
                  src="/placeholder.svg"
                  alt="Mono logo on white background"
                />
                <DownloadableLogoCard
                  src="/placeholder.svg"
                  alt="Mono logo on gray background"
                />
              </div>

              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>
            </div>
          </Container>
        </section>
        <Separator />
        <section className="pb-24 md:pb-32">
          <Container asGrid>
            <div className="grid grid-cols-10 gap-px">
              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>

              <div className="col-span-full grid gap-px sm:col-span-8 @4xl:grid-cols-2">
                <div data-grid-content className="col-span-full p-6 @4xl:p-12">
                  <h2 className="text-muted-foreground text-balance">Logomark</h2>
                  <p className="text-foreground mt-6 text-xl font-medium text-balance">
                    {" "}
                    The full logo combines the wordmark and symbol. Use it whenever space
                    allows, as it provides the strongest brand recognition. Maintain the
                    minimum clear space around the logo equal to the height of the symbol.
                  </p>
                </div>

                <DownloadableLogoCard
                  src="/placeholder.svg"
                  alt="Mono logomark on white background"
                />
                <DownloadableLogoCard
                  src="/placeholder.svg"
                  alt="Mono logomark on gray background"
                />
              </div>

              <div aria-hidden className="max-sm:hidden">
                <div data-grid-content />
              </div>
            </div>
          </Container>
        </section>
      </div>
    </Layout>
  );
}
