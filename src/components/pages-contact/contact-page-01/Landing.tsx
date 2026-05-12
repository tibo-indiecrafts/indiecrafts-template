import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { Container } from "@/components/ui-primitives/grid-2-contact-container";
import { EnterpriseForm } from "./sections/enterprise-form";
import { contactPage01Defaults, contactPage01Namespace } from "./config";

const benefits = [
  "24/7 support availability",
  "Dedicated account manager",
  "Custom integrations",
  "Priority response time",
];

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/** Tailark Pro `grid-2-contact-five` faithful port. */
export function Landing({
  layout = contactPage01Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
}: LandingProps = {}) {
  const t = useTranslations(contactPage01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Subtle theme-aware tint so the Container's `bg-card/90`
          grid cells stand out as visible 1px hairlines (mirrors
          upstream's `bg-zinc-950/10` main wrapper). `pt-14` clears
          the fixed `Header10` (h-14). */}
      <div className="bg-foreground/10 pt-14">
        <section id={contactPage01Defaults.sectionIds.hero}>
          <Container className="px-6 py-3 @4xl:px-12">
            <span className="text-muted-foreground font-mono text-sm uppercase">
              Sales
            </span>
          </Container>
          <Container asGrid>
            <div className="grid gap-px @4xl:grid-cols-2">
              <div data-grid-content className="p-6 @4xl:p-12">
                <h2 className="text-foreground text-5xl font-semibold tracking-tight text-balance">
                  {t("title")}
                </h2>
                <p className="text-muted-foreground mt-6 text-lg text-balance">
                  Get in touch with our sales team to discuss custom solutions for your
                  organization.
                </p>

                <ul className="mt-8 space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <CheckCircle2 className="size-4 shrink-0 fill-emerald-400/25 text-emerald-600 dark:text-emerald-500" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-muted-foreground mt-8 text-sm">
                  Looking for general support?{" "}
                  <Link
                    href="#support"
                    className="text-primary font-medium hover:underline"
                  >
                    Visit our help center
                  </Link>
                </div>

                <div className="mt-12 space-y-6 *:space-y-2">
                  <div>
                    <h3 className="text-muted-foreground text-sm">Email</h3>
                    <Link
                      href="mailto:hello@tailark.com"
                      className="text-foreground hover:decoration-primary text-sm font-medium hover:underline"
                    >
                      hello@tailark.com
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

              <div data-grid-content className="p-6 @4xl:p-12">
                <h2 className="text-foreground font-medium">Talk to our team</h2>
                <p className="text-muted-foreground mt-2 mb-12 text-sm">
                  Fill out the form and we&apos;ll be in touch within 24 hours.
                </p>

                <EnterpriseForm />
              </div>
            </div>
          </Container>
        </section>
      </div>
    </Layout>
  );
}
