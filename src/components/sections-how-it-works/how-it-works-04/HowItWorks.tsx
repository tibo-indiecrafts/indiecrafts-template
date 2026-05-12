import { ArrowBigRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui-primitives/button";
import { CurrencyIllustration } from "@/components/ui-illustrations/currency-illustration";
import { DocumentCsvIllustration } from "@/components/ui-illustrations/document-csv-illustration";
import { DocumentIllustration } from "@/components/ui-illustrations/document-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { howItWorks04Namespace } from "./config";
import type { HowItWorksBlock, HowItWorksIllustration } from "./schema";

const ILLUSTRATIONS: Record<HowItWorksIllustration, () => ReactNode> = {
  documentCsv: () => <DocumentCsvIllustration />,
  currency: () => <CurrencyIllustration />,
  documentPair: () => (
    <div className="flex gap-2">
      <DocumentIllustration />
      <DocumentIllustration />
    </div>
  ),
};

export default function HowItWorks(props: Readonly<HowItWorksBlock>) {
  const [, , tRoot] = useScopedT(howItWorks04Namespace);
  const ctaExternal = props.ctaHref.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`} className="overflow-hidden">
      <div className="bg-background m-4 rounded-[2rem] py-24">
        <div className="@container relative mx-auto w-full max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-primary">{tRoot(props.eyebrowKey)}</span>
            <h2
              id={`${props.id}-heading`}
              className="text-foreground mt-4 text-4xl font-semibold"
            >
              {tRoot(props.headerTitleKey)}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg text-balance">
              {tRoot(props.headerBodyKey)}
            </p>
          </div>

          <div className="my-20 grid gap-12 @3xl:grid-cols-3">
            {props.steps.map((step, index) => {
              const isLast = index === props.steps.length - 1;
              const renderIllustration = ILLUSTRATIONS[step.illustration];
              return (
                <div
                  key={index}
                  className="row-span-3 grid grid-rows-subgrid gap-8 text-center"
                >
                  <span className="bg-foreground/5 text-foreground mx-auto flex size-6 items-center justify-center rounded-full border text-sm font-medium">
                    {tRoot(step.numberKey)}
                  </span>

                  <div className="relative self-center">
                    <div className="mx-auto w-fit">{renderIllustration()}</div>
                    {!isLast ? (
                      <ArrowBigRight
                        aria-hidden="true"
                        className="fill-illustration stroke-illustration absolute inset-y-0 right-0 my-auto hidden translate-x-[150%] drop-shadow @3xl:block"
                      />
                    ) : null}
                  </div>

                  <div className="space-y-3 self-end">
                    <h3 className="text-foreground text-lg font-medium">
                      {tRoot(step.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-balance">
                      {tRoot(step.bodyKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button asChild variant="outline" className="mx-auto flex w-fit">
            <a
              href={props.ctaHref}
              target={ctaExternal ? "_blank" : undefined}
              rel={ctaExternal ? "noopener noreferrer" : undefined}
            >
              {tRoot(props.ctaLabelKey)}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
