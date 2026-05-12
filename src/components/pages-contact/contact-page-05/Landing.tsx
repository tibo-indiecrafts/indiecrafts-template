import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Container } from "@/components/ui-effects/grid-2-contact-two-container";
import { EnterpriseForm } from "./sections/enterprise-form";
import { contactPage05Defaults, contactPage05Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Landing({
  layout = contactPage05Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(contactPage05Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out as visible 1px hairlines. `pt-14`
          clears the fixed `Header10`. */}
      <div className="bg-foreground/10 pt-14">
        <section id={contactPage05Defaults.sectionIds.hero}>
          <Container asGrid>
            <div>
              <div data-grid-content className="p-6 @4xl:p-12">
                <div className="relative mx-auto max-w-xl pt-20 text-center @max-4xl:text-center">
                  <h2 className="text-foreground text-5xl font-semibold tracking-tight text-balance lg:text-6xl">
                    {t("title")}
                  </h2>
                  <p className="text-muted-foreground mx-auto mt-6 text-lg text-balance">
                    Find answers to your questions and get support for our services.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-px @4xl:grid-cols-4">
              <div aria-hidden data-grid-content className="min-h-12" />
              <div className="grid grid-cols-2 gap-px @4xl:col-span-2">
                <div data-grid-content className="space-y-2.5 p-6 *:block @4xl:p-12">
                  <h3 className="text-muted-foreground text-sm font-medium">
                    Collaborate
                  </h3>
                  <Link
                    href="mailto:hey@acme.com"
                    className="hover:decoration-primary font-medium hover:underline"
                  >
                    hey@acme.com
                  </Link>
                  <Link
                    href="tel:+6581234567"
                    className="hover:decoration-primary font-medium hover:underline"
                  >
                    +65 8123 4567
                  </Link>
                </div>
                <div data-grid-content className="space-y-2.5 p-6 *:block @4xl:p-12">
                  <h3 className="text-muted-foreground text-sm font-medium">Press</h3>
                  <Link
                    href="mailto:hey@acme.com"
                    className="hover:decoration-primary font-medium hover:underline"
                  >
                    press@acme.com
                  </Link>
                  <Link
                    href="tel:+6581234567"
                    className="hover:decoration-primary font-medium hover:underline"
                  >
                    +65 8123 4567
                  </Link>
                </div>
                <div data-grid-content className="col-span-full p-6 @4xl:p-12">
                  <EnterpriseForm />
                </div>
              </div>
              <div aria-hidden data-grid-content className="min-h-12" />
            </div>
          </Container>
        </section>
      </div>
    </Layout>
  );
}
