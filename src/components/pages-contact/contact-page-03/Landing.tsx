import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Button } from "@/components/ui-primitives/grid-2-contact-one-button";
import { Container } from "@/components/ui-primitives/grid-2-contact-one-container";
import { EnterpriseForm } from "./sections/enterprise-form";
import { contactPage03Defaults, contactPage03Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/** Tailark Pro `grid-2-contact-one` faithful port. */
export function Landing({
  layout = contactPage03Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(contactPage03Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out as visible 1px hairlines. `pt-14`
          clears the fixed `Header10`. */}
      <div className="bg-foreground/10 pt-14">
        <section id={contactPage03Defaults.sectionIds.hero}>
          <Container asGrid>
            <div>
              <div data-grid-content className="p-6 @4xl:p-12">
                <div className="relative max-w-3xl pt-20 @max-4xl:text-center">
                  <h2 className="text-foreground text-5xl font-semibold tracking-tight text-balance lg:text-6xl">
                    {t("title")}
                  </h2>
                  <p className="text-muted-foreground mx-auto mt-6 text-lg text-balance">
                    Get in touch with us to learn more about our Enterprise Invoicing
                    solution.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-px @xl:@max-4xl:grid-cols-4">
              <div aria-hidden data-grid-content className="min-h-12 @4xl:hidden" />
              <div className="grid gap-px @xl:@max-4xl:col-span-2">
                <div className="*:bg-card! grid gap-px @4xl:grid-cols-3">
                  <div data-grid-content className="p-6 @4xl:p-12">
                    <h2 className="font-medium">Enterprise Solutions</h2>
                    <p className="text-muted-foreground mt-2 mb-4 text-balance">
                      Discuss custom integrations and volume pricing for your
                      organization.
                    </p>
                    <Button variant="outline" size="sm" asChild className="mt-auto w-fit">
                      <Link href="#sales">Talk to sales</Link>
                    </Button>
                  </div>
                  <div data-grid-content className="p-6 @4xl:p-12">
                    <h2 className="text-lg font-medium">Technical Support</h2>
                    <p className="text-muted-foreground mt-2 mb-4 text-balance">
                      Our support team is available 24/7 to help resolve any issues.
                    </p>

                    <Button variant="outline" size="sm" asChild className="w-fit">
                      <Link href="/support">Open a ticket</Link>
                    </Button>
                  </div>
                  <div data-grid-content className="p-6 @4xl:p-12">
                    <h2 className="font-medium">Partnership Inquiries</h2>
                    <p className="text-muted-foreground mt-2 mb-4 text-balance">
                      Explore collaboration opportunities and affiliate programs.
                    </p>
                    <Button variant="outline" size="sm" asChild className="mt-auto w-fit">
                      <Link href="/partners">Become a partner</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-px @4xl:grid-cols-3">
                  <div data-grid-content className="p-6 @4xl:p-12">
                    <h2 className="text-muted-foreground mb-2 text-sm">General</h2>
                    <Link
                      href="mailto:hello@tailark.com"
                      className="hover:decoration-primary font-medium hover:underline"
                    >
                      hello@tailark.com
                    </Link>
                  </div>
                  <div data-grid-content className="p-6 @4xl:p-12">
                    <h2 className="text-muted-foreground mb-2 text-sm">Support</h2>
                    <Link
                      href="mailto:support@tailark.com"
                      className="hover:decoration-primary font-medium hover:underline"
                    >
                      support@tailark.com
                    </Link>
                  </div>

                  <div data-grid-content className="p-6 @4xl:p-12">
                    <h2 className="text-muted-foreground mb-2 text-sm">X/Twitter</h2>
                    <Link
                      href="https://twitter.com/tailarkui"
                      className="hover:decoration-primary font-medium hover:underline"
                    >
                      @tailarkui
                    </Link>
                  </div>
                  <div data-grid-content className="p-6 @4xl:p-12">
                    <h2 className="text-muted-foreground mb-2 text-sm">GitHub</h2>
                    <Link
                      href="https://github.com/tailark"
                      className="hover:decoration-primary font-medium hover:underline"
                    >
                      @tailark
                    </Link>
                  </div>
                  <div
                    aria-hidden
                    data-grid-content
                    className="col-span-2 @max-4xl:hidden"
                  />
                </div>
              </div>
              <div aria-hidden data-grid-content className="min-h-12 @4xl:hidden" />
            </div>
          </Container>
        </section>

        <section id="sales">
          <Container asGrid>
            <div>
              <div data-grid-content className="p-6 @4xl:p-12">
                <div className="relative mx-auto max-w-xl pt-20 text-center @max-4xl:text-center">
                  <h2 className="text-foreground text-5xl font-semibold tracking-tight text-balance lg:text-6xl">
                    Contact Sales
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
