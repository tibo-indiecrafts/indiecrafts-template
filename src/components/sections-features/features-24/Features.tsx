import { Cpu, Lock, Sparkles, Zap, type LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { IntegrationsIllustration } from "@/components/ui-illustrations/integrations-illustration";
import { InvoiceIllustration } from "@/components/ui-illustrations/invoice-illustration";
import { Button } from "@/components/ui-primitives/button";
import { IntelliJIDEA } from "@/components/ui-primitives/svgs/intellij";
import { VisualStudioCode } from "@/components/ui-primitives/svgs/vs-code";
import { Windsurf } from "@/components/ui-primitives/svgs/windsurf";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { features24Namespace } from "./config";
import type { CardIllustration, FeaturesBlock, IdeIcon, StatIcon } from "./schema";

const ILLUSTRATIONS: Record<CardIllustration, ComponentType> = {
  invoice: InvoiceIllustration,
  integrations: IntegrationsIllustration,
};

const IDE_ICONS: Record<IdeIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  intellij: IntelliJIDEA,
  vsCode: VisualStudioCode,
  windsurf: Windsurf,
};

const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features24Namespace);
  const external = props.ctaHref.startsWith("http");

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-(--gutter) xl:px-0">
        <div className="relative">
          <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 bottom-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />

          <div className="border-foreground/10 divide-foreground/10 relative grid grid-cols-2 overflow-hidden border *:p-4 *:nth-3:border-r-0! *:nth-[1n+1]:nth-[-n+5]:border-b @max-3xl:*:nth-4:border-r @max-3xl:*:nth-6:border-r @3xl:grid-cols-4 @3xl:*:nth-[1n+1]:nth-[-n+3]:border-b @3xl:*:nth-[1n+2]:nth-[-n+6]:border-r @4xl:*:p-8">
            <div className="col-span-full">
              <div className="mx-auto max-w-xl pt-8 text-center">
                <h2
                  id={`${props.id}-title`}
                  className="text-4xl font-semibold text-balance"
                >
                  {tr(props.titleKey, "title")}
                </h2>
                <p className="text-muted-foreground my-6 text-lg text-balance">
                  {tr(props.bodyKey, "body")}
                </p>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={props.ctaHref}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {tr(props.ctaLabelKey, "cta")}
                  </a>
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-x-0 bottom-4 z-10 mx-auto max-w-56 space-y-3">
                  <h3 className="text-center font-medium">
                    {tr(props.ideListLabelKey, "ideListLabel")}
                  </h3>
                  <div className="*:bg-foreground/5 grid grid-cols-3 gap-0.5 *:flex *:items-center *:justify-center *:rounded *:px-2 *:py-3">
                    {props.ides.map((ide, i) => {
                      const Icon = IDE_ICONS[ide];
                      const radius =
                        i === 0
                          ? "!rounded-l-lg"
                          : i === props.ides.length - 1
                            ? "!rounded-r-lg"
                            : "";
                      return (
                        <div key={ide} className={radius}>
                          <Icon className="size-5" aria-hidden="true" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mx-auto mt-16 max-w-4xl mask-b-from-35% px-4 pt-1 @4xl:px-8">
                  <div className="bg-background ring-border-illustration relative h-64 overflow-hidden rounded-(--radius) border border-transparent shadow-xl ring-1 shadow-black/10 @4xl:h-80">
                    <Image
                      src={props.screenshotUrl}
                      alt={tRoot(props.screenshotAltKey)}
                      width={2880}
                      height={1842}
                      className="size-full object-cover object-top-left"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>

            {props.cards.map((card, i) => {
              const Illustration = ILLUSTRATIONS[card.illustration];
              const isSecond = i === 1;
              return (
                <div
                  key={i}
                  className={cn(
                    "col-span-2 row-span-2 grid grid-rows-subgrid gap-8 p-8!",
                    isSecond && "relative",
                  )}
                >
                  {isSecond ? (
                    <PlusDecorator className="bottom-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]" />
                  ) : null}
                  <div
                    className={
                      card.illustration === "integrations"
                        ? "mx-auto max-w-sm self-center @4xl:px-8"
                        : "mx-auto w-full max-w-84 self-center"
                    }
                  >
                    <Illustration />
                  </div>
                  <div
                    className={cn(
                      "mx-auto max-w-sm text-center",
                      isSecond && "relative z-10",
                    )}
                  >
                    <h3 className="font-semibold text-balance">{tRoot(card.titleKey)}</h3>
                    <p className="text-muted-foreground mt-3">{tRoot(card.bodyKey)}</p>
                  </div>
                </div>
              );
            })}

            {props.stats.map((stat, i) => {
              const Icon = STAT_ICONS[stat.iconKey];
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="text-foreground size-4" aria-hidden="true" />
                    <h3 className="text-sm font-medium">{tRoot(stat.titleKey)}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{tRoot(stat.bodyKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlusDecorator({ className }: Readonly<{ className?: string }>) {
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
