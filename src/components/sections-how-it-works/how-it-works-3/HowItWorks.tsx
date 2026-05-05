import Image from "next/image";
import type { ComponentType } from "react";
import { CodeWindowIllustration } from "@/components/ui-illustrations/code-window-illustration";
import { MonitoringBarchartIllustration } from "@/components/ui-illustrations/monitoring-barchart-illustration";
import { ScanIllustration } from "@/components/ui-illustrations/scan-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { howItWorks3Namespace } from "./config";
import type { HowItWorksBlock, HowItWorksIllustration } from "./schema";

const ILLUSTRATIONS: Record<HowItWorksIllustration, ComponentType> = {
  monitoringBarchart: MonitoringBarchartIllustration,
  scan: ScanIllustration,
  codeWindow: CodeWindowIllustration,
};

export default function HowItWorks(props: Readonly<HowItWorksBlock>) {
  const [, , tRoot] = useScopedT(howItWorks3Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-6 py-24 xl:px-0">
        <div className="@container relative">
          <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 bottom-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <div className="grid grid-cols-1 border @3xl:grid-cols-3 @3xl:divide-x">
            <div className="w-full p-6 @xl:p-8 @4xl:p-12">
              <h2
                id={`${props.id}-heading`}
                className="text-foreground mb-6 text-3xl font-semibold"
              >
                {tRoot(props.headerTitleKey)}
              </h2>
              <p className="text-muted-foreground text-lg">
                {tRoot(props.headerBodyKey)}
              </p>
            </div>

            <div className="relative col-span-2 divide-y *:p-6 @xl:*:p-8 @4xl:*:p-12">
              {props.steps.map((step, index) => {
                const Illustration = ILLUSTRATIONS[step.illustration];
                return (
                  <div key={index} className="group space-y-6">
                    <div>
                      <span className="bg-foreground/5 text-foreground flex size-7 items-center justify-center rounded-full text-sm font-medium">
                        {tRoot(step.numberKey)}
                      </span>
                      <h3 className="text-foreground my-4 text-lg font-semibold">
                        {tRoot(step.titleKey)}
                      </h3>
                      <p className="text-muted-foreground">{tRoot(step.bodyKey)}</p>
                    </div>

                    <Illustration />

                    {step.testimonial ? (
                      <blockquote className="before:bg-primary relative mt-12 max-w-xl pl-4 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full">
                        <p>{tRoot(step.testimonial.quoteKey)}</p>
                        <div className="mt-6 flex items-center gap-2">
                          <div className="bg-background size-6 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                            <Image
                              className="aspect-square rounded-full object-cover"
                              src={step.testimonial.authorAvatarUrl}
                              alt=""
                              aria-hidden="true"
                              height={46}
                              width={46}
                            />
                          </div>
                          <span>{tRoot(step.testimonial.authorNameKey)}</span>
                          <span className="text-muted-foreground">
                            {tRoot(step.testimonial.authorHandleKey)}
                          </span>
                        </div>
                      </blockquote>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlusDecorator({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "before:bg-foreground/25 after:bg-foreground/25 absolute size-3 mask-radial-from-15% before:absolute before:inset-0 before:m-auto before:h-px after:absolute after:inset-0 after:m-auto after:w-px",
        className,
      )}
    />
  );
}
