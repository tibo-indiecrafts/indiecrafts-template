import type { ReactNode } from "react";
import { InvoiceIllustration } from "@/components/ui-illustrations/invoice-illustration-02";
import { InvoiceSigningIllustration } from "@/components/ui-illustrations/invoice-signing-illustration-02";
import { PaymentIllustration } from "@/components/ui-illustrations/payment-illustration-02";
import { useScopedT } from "@/components/_lib/scoped-t";
import { howItWorks08Namespace } from "./config";
import type { HowItWorksBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <span className="text-foreground font-medium">{chunks}</span>
  ),
};

function IllustrationPerspective({ children }: { children: ReactNode }) {
  return (
    <div className="self-end mask-radial-[100%_100%] mask-radial-from-60% mask-radial-at-top-left pt-2 pl-2 perspective-dramatic @md:pt-6 @4xl:pl-4">
      <div>{children}</div>
    </div>
  );
}

export default function HowItWorks(props: Readonly<HowItWorksBlock>) {
  const [, , tRoot] = useScopedT(howItWorks08Namespace);
  const [step1, step2, step3] = props.steps;

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <div className="@container relative pt-24 pb-12 [--color-card:color-mix(in_oklab,var(--color-zinc-900)_70%,var(--color-background))] md:py-40">
        <div className="relative mx-auto w-full max-w-5xl px-6">
          <div className="mb-16">
            <span className="text-primary font-mono text-sm uppercase">
              {tRoot(props.eyebrowKey)}
            </span>
            <div className="mt-8 grid items-end gap-6 md:grid-cols-2">
              <h2
                id={`${props.id}-heading`}
                className="text-foreground text-4xl font-semibold md:text-5xl"
              >
                {tRoot(props.titleKey)}
              </h2>
              <div className="lg:pl-12">
                <p className="text-muted-foreground text-balance">
                  {tRoot(props.bodyKey)}
                </p>
              </div>
            </div>
          </div>
          <div className="mx-auto lg:-mx-12 @max-4xl:max-w-sm">
            <div className="grid @max-4xl:gap-12 @4xl:grid-cols-3">
              <div className="row-span-2 grid grid-rows-subgrid gap-8">
                <div className="relative self-end @max-4xl:-ml-1">
                  <div
                    aria-hidden
                    className="absolute inset-0 size-3/5 rounded-full bg-blue-400 opacity-10 blur-xl"
                  />
                  <IllustrationPerspective>
                    <PaymentIllustration />
                  </IllustrationPerspective>
                </div>
                <div className="@4xl:px-12">
                  <h3 className="font-semibold text-balance">{tRoot(step1.titleKey)}</h3>
                  <p className="text-muted-foreground mt-4">
                    {tRoot.rich(step1.bodyKey, RICH_STRONG)}
                  </p>
                </div>
              </div>
              <div className="row-span-2 grid grid-rows-subgrid gap-8">
                <div className="relative self-end @max-4xl:-ml-1">
                  <div
                    aria-hidden
                    className="absolute inset-0 size-3/5 rounded-full bg-indigo-400 opacity-10 blur-xl"
                  />
                  <IllustrationPerspective>
                    <InvoiceSigningIllustration />
                  </IllustrationPerspective>
                </div>
                <div className="@4xl:px-12">
                  <h3 className="font-semibold text-balance">{tRoot(step2.titleKey)}</h3>
                  <p className="text-muted-foreground mt-4">
                    {tRoot.rich(step2.bodyKey, RICH_STRONG)}
                  </p>
                </div>
              </div>
              <div className="row-span-2 grid grid-rows-subgrid gap-8">
                <div className="relative self-end @max-4xl:-ml-1">
                  <div
                    aria-hidden
                    className="absolute inset-0 size-3/5 rounded-full bg-blue-400 opacity-10 blur-xl"
                  />
                  <IllustrationPerspective>
                    <InvoiceIllustration />
                  </IllustrationPerspective>
                </div>
                <div className="@4xl:px-12">
                  <h3 className="font-semibold text-balance">{tRoot(step3.titleKey)}</h3>
                  <p className="text-muted-foreground mt-4">
                    {tRoot.rich(step3.bodyKey, RICH_STRONG)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
