import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Container } from "@/components/ui-primitives/grid-2-contact-four-container";
import { EnterpriseForm } from "./sections/enterprise-form";
import { contactPage02Defaults, contactPage02Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function Landing({
  layout = contactPage02Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(contactPage02Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out as visible 1px hairlines. `pt-14`
          clears the fixed `Header10`. */}
      <div className="bg-foreground/10 pt-14">
        <section id={contactPage02Defaults.sectionIds.hero}>
          <Container asGrid>
            <div>
              <div data-grid-content className="p-6 @4xl:p-12">
                <div className="max-w-xl pt-20 @max-4xl:text-center">
                  <h2 className="text-foreground text-5xl font-semibold tracking-tight text-balance">
                    {t("title")}
                  </h2>
                  <p className="text-muted-foreground mx-auto mt-6 text-lg text-balance">
                    Let&apos;s discuss how we can help you achieve your goals.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-px @4xl:grid-cols-2">
              <div data-grid-content className="p-6 @4xl:p-12">
                <h2 className="text-foreground font-medium">Talk to our team</h2>
                <p className="text-muted-foreground mt-2 mb-12 text-sm">
                  Fill out the form and we&apos;ll be in touch within 24 hours.
                </p>

                <EnterpriseForm />
              </div>
              <div data-grid-content className="space-y-6 p-6 *:space-y-2 @4xl:p-12">
                <div>
                  <h3 className="text-muted-foreground text-sm">Email</h3>
                  <Link
                    href="mailto:hello@acme.com"
                    className="text-foreground hover:decoration-primary text-sm font-medium hover:underline"
                  >
                    hello@acme.com
                  </Link>
                </div>

                <div>
                  <h3 className="text-muted-foreground text-sm">Phone</h3>
                  <Link
                    href="tel:+1234567890"
                    className="text-foreground hover:decoration-primary text-sm font-medium hover:underline"
                  >
                    +1 (234) 567-890
                  </Link>
                </div>

                <div>
                  <h3 className="text-muted-foreground text-sm">Office</h3>
                  <p className="text-foreground text-sm font-medium">
                    123 Innovation Drive
                    <br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </Layout>
  );
}
