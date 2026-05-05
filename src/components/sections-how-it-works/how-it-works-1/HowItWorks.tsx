import type { ComponentType, ReactNode } from "react";
import { InvoiceCardIllustration } from "@/components/ui-illustrations/invoice-card-illustration";
import { InvoiceSigningIllustration } from "@/components/ui-illustrations/invoice-signing-illustration";
import { PaymentIllustration } from "@/components/ui-illustrations/payment-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { howItWorks1Namespace } from "./config";
import type { HowItWorksBlock, HowItWorksIllustration } from "./schema";

const ILLUSTRATIONS: Record<HowItWorksIllustration, ComponentType> = {
  payment: PaymentIllustration,
  invoiceSigning: InvoiceSigningIllustration,
  invoiceCard: InvoiceCardIllustration,
};

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <span className="text-foreground font-medium">{chunks}</span>
  ),
};

export default function HowItWorks(props: Readonly<HowItWorksBlock>) {
  const [, , tRoot] = useScopedT(howItWorks1Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-16 md:py-24 lg:py-40"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        How it works
      </h2>
      <div className="relative mx-auto w-full max-w-5xl @max-6xl:px-6">
        <div className="mx-auto @max-4xl:max-w-sm">
          <div className="grid @max-4xl:gap-12 @4xl:grid-cols-3">
            {props.steps.map((step, index) => {
              const Illustration = ILLUSTRATIONS[step.illustration];
              return (
                <div key={index} className="row-span-2 grid grid-rows-subgrid gap-8">
                  <div className="@4xl:pr-12">
                    <h3 className="text-lg font-semibold text-balance">
                      <span className="text-muted-foreground self-center font-mono text-sm">
                        {tRoot(step.numberKey)}
                      </span>{" "}
                      {tRoot(step.titleKey)}
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      {tRoot.rich(step.bodyKey, RICH_STRONG)}
                    </p>
                  </div>
                  <IllustrationPerspective>
                    <Illustration />
                  </IllustrationPerspective>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function IllustrationPerspective({ children }: { children: ReactNode }) {
  return (
    <div className="mask-radial-[95%_100%] mask-radial-from-60% mask-radial-at-top-left pt-6 pl-5 perspective-dramatic @4xl:pl-4">
      <div className="rotate-y-3 -skew-y-4">{children}</div>
    </div>
  );
}
