import type { ReactNode } from "react";
import { CampaignCardIllustration } from "@/components/ui-illustrations/campaign-card-illustration";
import { MemoryUsageIllustration } from "@/components/ui-illustrations/memory-usage-illustration";
import { PollIllustration } from "@/components/ui-illustrations/poll-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { howItWorks07Namespace } from "./config";
import type { HowItWorksBlock, HowItWorksIllustration } from "./schema";

const ILLUSTRATIONS: Record<HowItWorksIllustration, () => ReactNode> = {
  campaign: () => <CampaignCardIllustration />,
  poll: () => <PollIllustration />,
  memoryUsage: () => <MemoryUsageIllustration borderPosition="bottom" />,
};

const RICH_STRONG = {
  strong: (chunks: ReactNode) => <span className="text-foreground">{chunks}</span>,
};

export default function HowItWorks(props: Readonly<HowItWorksBlock>) {
  const [, , tRoot] = useScopedT(howItWorks07Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
        <div className="text-center @4xl:text-left">
          <h2
            id={`${props.id}-heading`}
            className="text-foreground text-3xl font-semibold"
          >
            {tRoot(props.headerTitleKey)}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-balance">
            {tRoot.rich(props.headerBodyKey, RICH_STRONG)}
          </p>
        </div>

        <div className="relative mx-auto mt-12 @max-4xl:max-w-sm">
          <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 bottom-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <div className="grid overflow-hidden border [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] [--color-card:color-mix(in_oklab,var(--color-muted)15%,var(--color-background))] *:p-8 @max-4xl:divide-y @4xl:grid-cols-3 @4xl:divide-x">
            {props.steps.map((step, index) => {
              const renderIllustration = ILLUSTRATIONS[step.illustration];
              return (
                <div key={index} className="row-span-2 grid grid-rows-subgrid gap-8">
                  <div
                    aria-hidden
                    className={cn(
                      "relative flex flex-col",
                      step.verticalAlign === "end" ? "justify-end" : "justify-center",
                      step.decoratedBackdrop && "gap-6",
                    )}
                  >
                    <Counter>{tRoot(step.numberKey)}</Counter>
                    {step.decoratedBackdrop ? (
                      <div className="relative">
                        <div
                          aria-hidden
                          className="from-primary absolute inset-1/3 m-auto aspect-video rounded-full bg-linear-to-br/increasing to-indigo-500 blur-3xl not-dark:opacity-50"
                        />
                        <div
                          aria-hidden
                          className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] mask-y-from-55% mask-r-from-55% bg-[size:2px_2px] not-dark:opacity-50"
                        />
                        {renderIllustration()}
                      </div>
                    ) : (
                      renderIllustration()
                    )}
                  </div>
                  <div className={cn(index === 2 && "mt-8 @4xl:mt-0")}>
                    <h3 className="text-foreground font-semibold">
                      {tRoot(step.titleKey)}
                    </h3>
                    <p className="text-muted-foreground mt-2">{tRoot(step.bodyKey)}</p>
                  </div>
                </div>
              );
            })}
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

function Counter({ children }: { children: ReactNode }) {
  return (
    <div className="text-foreground top-0 flex size-6 -translate-x-1/3 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full mask-y-from-55% mask-x-from-55% font-mono text-sm before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_0.5px,transparent_0.5px,transparent_3px)] before:opacity-35 @4xl:absolute">
      {children}
    </div>
  );
}
