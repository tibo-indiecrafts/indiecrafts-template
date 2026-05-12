import Link from "next/link";
import { ArrowBigRight } from "lucide-react";
import { Button } from "@/components/ui-primitives/libre-landing-two-button";
import { CurrencyIllustration } from "@/components/ui-illustrations/libre-landing-two-currency-illustration";
import { DocumentIllustation } from "@/components/ui-illustrations/libre-landing-two-document-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { howItWorks09Namespace } from "./config";
import type { HowItWorks09Block } from "./schema";

/**
 * Tailark Pro `libre-landing-two` HowItWorks — JSX verbatim.
 * 3-step workflow with numbered badges, illustrations, arrow
 * connectors at @3xl, and an outline CTA at the bottom.
 */
export default function HowItWorks(props: Readonly<HowItWorks09Block>) {
  const [t] = useScopedT(howItWorks09Namespace);
  const external = props.ctaHref.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`} className="relative">
      <div className="relative py-24">
        <div className="@container relative mx-auto w-full max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-primary text-sm uppercase">{t("eyebrow")}</span>
            <h2
              id={`${props.id}-heading`}
              className="text-foreground mt-8 text-4xl font-semibold md:text-5xl"
            >
              {t("title")}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg text-balance">{t("body")}</p>
          </div>

          <div className="my-20 grid gap-12 @3xl:grid-cols-3">
            <div className="space-y-6">
              <div className="text-center">
                <span className="mx-auto flex size-6 items-center justify-center rounded-full bg-zinc-500/15 text-sm font-medium text-zinc-700">
                  1
                </span>
                <div className="relative">
                  <div className="mx-auto my-6 w-fit">
                    <DocumentIllustation />
                  </div>
                  <ArrowBigRight
                    aria-hidden
                    className="fill-background stroke-background absolute inset-y-0 right-0 my-auto hidden translate-x-[150%] drop-shadow @3xl:block"
                  />
                </div>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  {t("step1.title")}
                </h3>
                <p className="text-muted-foreground text-balance">{t("step1.body")}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <span className="mx-auto flex size-6 items-center justify-center rounded-full bg-zinc-500/15 text-sm font-medium text-zinc-700">
                  2
                </span>
                <div className="relative">
                  <div className="mx-auto my-6 w-fit">
                    <CurrencyIllustration />
                  </div>
                  <ArrowBigRight
                    aria-hidden
                    className="fill-background stroke-background absolute inset-y-0 right-0 my-auto hidden translate-x-[150%] drop-shadow @3xl:block"
                  />
                </div>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  {t("step2.title")}
                </h3>
                <p className="text-muted-foreground text-balance">{t("step2.body")}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <span className="mx-auto flex size-6 items-center justify-center rounded-full bg-zinc-500/15 text-sm font-medium text-zinc-700">
                  3
                </span>
                <div className="mx-auto my-6 flex w-fit gap-2">
                  <DocumentIllustation />
                  <DocumentIllustation />
                </div>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  {t("step3.title")}
                </h3>
                <p className="text-muted-foreground text-balance">{t("step3.body")}</p>
              </div>
            </div>
          </div>

          <Button asChild variant="outline" className="mx-auto flex w-fit">
            <Link
              href={props.ctaHref}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              {t("cta")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
