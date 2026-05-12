import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Container } from "@/components/ui-primitives/grid-2-contact-sales-one-container";
import { EnterpriseForm } from "./sections/enterprise-form";
import { contactPage06Defaults, contactPage06Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Landing({
  layout = contactPage06Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(contactPage06Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out as visible 1px hairlines. `pt-14`
          clears the fixed `Header10`. */}
      <div className="bg-foreground/10 pt-14">
        <section id={contactPage06Defaults.sectionIds.hero}>
          <Container asGrid>
            <div>
              <div data-grid-content className="p-6 @4xl:p-12">
                <div className="relative mx-auto max-w-xl pt-20 text-center @max-4xl:text-center">
                  <h2 className="text-foreground text-5xl font-semibold tracking-tight text-balance lg:text-6xl">
                    {t("title")}
                  </h2>
                  <p className="text-muted-foreground mx-auto mt-6 text-lg text-balance">
                    Have a question or want to work together? Fill out the form and
                    we&apos;ll get back to you as soon as possible.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-px @4xl:grid-cols-4">
              <div aria-hidden data-grid-content className="min-h-12" />
              <div data-grid-content className="p-6 @4xl:col-span-2 @4xl:p-12">
                <EnterpriseForm />
              </div>
              <div aria-hidden data-grid-content className="min-h-12" />
            </div>
          </Container>
        </section>
      </div>
    </Layout>
  );
}
