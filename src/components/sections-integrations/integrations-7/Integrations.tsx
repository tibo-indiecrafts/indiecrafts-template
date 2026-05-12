import type { ComponentType, ReactNode, SVGProps } from "react";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { Linear } from "@/components/ui-primitives/svgs/linear";
import { MediaWiki } from "@/components/ui-primitives/svgs/media-wiki";
import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { Vercel } from "@/components/ui-primitives/svgs/vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { integrations7Namespace } from "./config";
import type { IntegrationIcon, IntegrationsBlock } from "./schema";

const ICONS: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  gemini: Gemini,
  linear: Linear,
  replit: Replit,
  vercel: Vercel,
  openai: OpenAI,
  mediaWiki: MediaWiki,
  claude: Claude,
};

const SLOT_CLASSES = [
  "col-start-3",
  "col-start-9 md:row-start-8 md:translate-x-1/2",
  "md:row-start-3",
  "col-start-3 md:row-start-5",
  "col-start-16",
  "col-start-18 md:row-start-3",
  "col-start-16 md:row-start-5",
] as const;

export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [, , tRoot] = useScopedT(integrations7Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative">
          <div className="inset-0 m-auto !aspect-auto h-fit w-full max-w-xl space-y-4 text-center md:absolute">
            <h2
              id={`${props.id}-heading`}
              className="text-3xl font-semibold text-balance md:text-5xl"
            >
              {tRoot(props.headerTitleKey)}
            </h2>
            <p className="text-muted-foreground text-lg text-balance">
              {tRoot(props.headerBodyKey)}
            </p>
          </div>

          <div className="grid gap-1 *:aspect-square max-md:mt-12 md:grid-cols-18 md:grid-rows-6">
            <DecorativeCell
              className="col-start-3 md:row-start-2"
              innerClassName="bg-muted/50 ml-auto mt-auto translate-x-full translate-y-[125%]"
            />
            <DecorativeCell
              className="md:row-start-5"
              innerClassName="bg-muted/50 ml-auto md:-translate-y-[125%] md:translate-x-full"
            />
            <DecorativeCell
              className="col-start-16 md:row-start-3"
              innerClassName="bg-muted md:-translate-x-full md:-translate-y-[125%]"
            />
            <DecorativeCell
              className="col-start-18 md:row-start-5"
              innerClassName="bg-muted md:-translate-x-full md:-translate-y-[125%]"
            />

            {props.icons.map((iconKey, index) => {
              const Icon = ICONS[iconKey];
              return (
                <IntegrationCard key={index} className={SLOT_CLASSES[index]}>
                  <Icon />
                </IntegrationCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function IntegrationCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-card ring-foreground/10 relative z-20 m-auto flex size-full rounded-full border border-transparent shadow-md ring-1 *:m-auto *:size-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DecorativeCell({
  className,
  innerClassName,
}: {
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div aria-hidden className={cn("flex max-md:hidden", className)}>
      <div className={cn("size-1/2 rounded-lg border", innerClassName)} />
    </div>
  );
}
