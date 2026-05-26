import Image from "next/image";
import type { ComponentType, ReactNode } from "react";
import { ChartIllustration } from "@/components/ui-illustrations/chart-illustration";
import { GanttChartIllustration } from "@/components/ui-illustrations/gantt-chart-illustration";
import { LayoutIllustration } from "@/components/ui-illustrations/layout-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import type { MessageKey } from "@/types/messages";
import { cn } from "@/lib/utils";
import { howItWorks02Namespace } from "./config";
import type {
  HowItWorksBlock,
  HowItWorksIllustration,
  HowItWorksStep,
  SupportiveContent,
} from "./schema";

const ILLUSTRATIONS: Record<HowItWorksIllustration, ComponentType> = {
  chart: ChartIllustration,
  ganttChart: GanttChartIllustration,
  layout: LayoutIllustration,
};

export default function HowItWorks(props: Readonly<HowItWorksBlock>) {
  const [, , tRoot] = useScopedT(howItWorks02Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background overflow-hidden py-24"
    >
      <div className="relative mx-auto max-w-5xl space-y-2 pr-6 md:px-6">
        <div className="mb-32 max-w-xl space-y-4 max-md:pl-6">
          <h2
            id={`${props.id}-heading`}
            className="text-foreground text-3xl font-semibold text-balance"
          >
            {tRoot(props.headerTitleKey)}
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            {tRoot(props.headerBodyKey)}
          </p>
        </div>

        {props.steps.map((step, index) => {
          const isLast = index === props.steps.length - 1;
          return <Step key={index} step={step} isLast={isLast} tRoot={tRoot} />;
        })}
      </div>
    </section>
  );
}

function Step({
  step,
  isLast,
  tRoot,
}: Readonly<{
  step: HowItWorksStep;
  isLast: boolean;
  tRoot: (key: MessageKey) => string;
}>) {
  const Illustration = ILLUSTRATIONS[step.illustration];

  return (
    <div className="flex gap-4 max-md:pl-4 sm:gap-8 md:gap-16 lg:gap-24">
      <LineGroup>
        <StepNumber>{tRoot(step.numberKey)}</StepNumber>
        <Line nodePosition={isLast ? "top" : "bottom"} nodeSide="right" isLast={isLast} />
      </LineGroup>
      <div
        className={cn(
          "w-full",
          isLast ? "w-[calc(100%-3rem)] md:w-[calc(100%-8rem)]" : "pb-32",
        )}
      >
        <div className="relative z-10 max-w-xl space-y-3">
          <h3 className="text-foreground text-xl font-semibold text-balance">
            {tRoot(step.titleKey)}
          </h3>
          <p className="text-muted-foreground text-balance md:text-lg">
            {tRoot(step.bodyKey)}
          </p>

          {step.supportive?.kind === "stats" ? (
            <div className="mt-12 flex gap-12">
              {step.supportive.stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-foreground text-4xl font-bold">
                    {tRoot(stat.valueKey)}
                  </div>
                  <p className="text-muted-foreground text-sm">{tRoot(stat.labelKey)}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div
          className={cn(step.illustration === "chart" ? "-mt-24" : "mt-16")}
          aria-hidden
        >
          <Illustration />
        </div>

        {step.supportive?.kind === "testimonial" ? (
          <TestimonialBlock content={step.supportive} tRoot={tRoot} />
        ) : null}
      </div>
    </div>
  );
}

function TestimonialBlock({
  content,
  tRoot,
}: Readonly<{
  content: Extract<SupportiveContent, { kind: "testimonial" }>;
  tRoot: (key: MessageKey) => string;
}>) {
  const { quoteKey, authorNameKey, authorHandleKey, authorAvatarUrl } =
    content.testimonial;
  return (
    <blockquote className="before:bg-primary relative mt-12 max-w-xl pl-4 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full">
      <p>{tRoot(quoteKey)}</p>
      <div className="mt-6 flex items-center gap-2">
        <div className="bg-background size-6 rounded-full border p-0.5 shadow shadow-zinc-950/5">
          <Image
            className="aspect-square rounded-full object-cover"
            src={authorAvatarUrl}
            alt=""
            aria-hidden="true"
            height={46}
            width={46}
          />
        </div>
        <span>{tRoot(authorNameKey)}</span>
        <span className="text-muted-foreground">{tRoot(authorHandleKey)}</span>
      </div>
    </blockquote>
  );
}

function StepNumber({ children }: { children: ReactNode }) {
  return (
    <span className="bg-background ring-foreground/10 text-foreground relative flex size-6 items-center justify-center rounded-full border border-transparent font-mono text-xs font-medium shadow ring-1">
      {children}
    </span>
  );
}

function LineGroup({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid w-7 grid-rows-[auto_1fr] [--color-border:color-mix(in_oklab,var(--color-foreground)10%,var(--color-background))]">
      {children}
    </div>
  );
}

type LineProps = {
  isLast?: boolean;
  nodePosition?: "top" | "bottom" | "center";
  nodeSide?: "left" | "right";
};

function Line({ isLast, nodePosition = "top", nodeSide = "left" }: LineProps) {
  return (
    <div className="relative" aria-hidden>
      <div
        className={cn(
          "bg-border border-background absolute inset-x-0 top-2 mx-auto w-0.5 border-r",
          {
            "h-[calc(4rem+0.75px)]": nodePosition === "top",
            "bottom-[calc(50%+5.45rem)]": nodePosition === "center",
            "bottom-[15.45rem]": nodePosition === "bottom",
          },
        )}
      />

      <div
        className={cn(
          "bg-border border-background absolute inset-x-0 bottom-0 mx-auto w-0.5 border-r",
          isLast && "mask-b-from-35%",
          {
            "top-[15.5rem]": nodePosition === "top",
            "top-[calc(50%+5.5rem)]": nodePosition === "center",
            "h-[4.5rem]": nodePosition === "bottom",
          },
        )}
      />

      <LineNode position={nodePosition} side={nodeSide} />
    </div>
  );
}

type NodeProps = {
  position?: "top" | "bottom" | "center";
  side?: "left" | "right";
};

function LineNode({ position = "top", side = "left" }: NodeProps) {
  return (
    <div
      className={cn("absolute inset-x-0 h-40", {
        "top-20": position === "top",
        "bottom-20": position === "bottom",
        "inset-y-0 my-auto": position === "center",
        "translate-x-[0.5px] -scale-x-100": side === "right",
      })}
    >
      <div
        className={cn(
          "absolute top-0 left-0 h-40 w-1/2 -translate-x-2 rounded-l-full border-y border-l",
          { "border-background": side === "right" },
        )}
      >
        <div
          className={cn("size-full rounded-l-full border-y border-l", {
            "border-background": side === "left",
          })}
        />
      </div>
      <div
        className={cn(
          "absolute right-1/2 -bottom-2 size-2.5 translate-x-px rounded-tr-full border-t border-r",
          { "border-background": side === "left" },
        )}
      >
        <div
          className={cn("size-full rounded-tr-full border-t border-r", {
            "border-background": side === "right",
          })}
        />
      </div>
      <div
        className={cn(
          "absolute -top-[7px] right-1/2 size-[9px] translate-x-px rounded-br-full border-r border-b",
          { "border-background": side === "left" },
        )}
      >
        <div
          className={cn("size-full rounded-br-full border-r border-b", {
            "border-background": side === "right",
          })}
        />
      </div>
    </div>
  );
}
