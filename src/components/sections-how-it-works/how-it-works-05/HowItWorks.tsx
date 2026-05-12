import { ArrowBigDown } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui-primitives/button";
import { CurrencyIllustration } from "@/components/ui-illustrations/currency-illustration";
import { DocumentCsvIllustration } from "@/components/ui-illustrations/document-csv-illustration";
import { DocumentIllustration } from "@/components/ui-illustrations/document-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { howItWorks05Namespace } from "./config";
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
  const [, , tRoot] = useScopedT(howItWorks05Namespace);
  const ctaExternal = props.ctaHref.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`} className="overflow-hidden">
      <div className="bg-background m-4 rounded-[2rem] py-24">
        <div className="relative mx-auto w-full max-w-5xl px-6">
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

          <div className="mx-auto my-8 grid gap-12 *:py-6 md:max-w-1/3">
            {props.steps.map((step, index) => {
              const isLast = index === props.steps.length - 1;
              const renderIllustration = ILLUSTRATIONS[step.illustration];
              return (
                <div key={index} className="relative">
                  <div className="text-center">
                    <span className="bg-foreground/5 text-foreground mx-auto flex size-6 items-center justify-center rounded-full border text-sm font-medium">
                      {tRoot(step.numberKey)}
                    </span>
                    <div className="mx-auto my-8 w-fit">{renderIllustration()}</div>
                    <h3 className="text-foreground mb-3 text-lg font-medium">
                      {tRoot(step.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-balance">
                      {tRoot(step.bodyKey)}
                    </p>
                  </div>
                  {!isLast ? (
                    <ArrowBigDown
                      aria-hidden="true"
                      className="fill-illustration stroke-illustration absolute inset-x-0 bottom-0 mx-auto translate-y-[150%] drop-shadow"
                    />
                  ) : null}
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
