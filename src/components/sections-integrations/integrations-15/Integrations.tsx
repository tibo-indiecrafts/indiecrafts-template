import type { ComponentType, ReactNode, SVGProps } from "react";
import Link from "next/link";
import { Button } from "@/components/ui-primitives/button";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { MagicUI } from "@/components/ui-primitives/svgs/magic-ui";
import { VSCodium } from "@/components/ui-primitives/svgs/vs-codium";
import { MediaWiki } from "@/components/ui-primitives/svgs/media-wiki";
import { GooglePaLM } from "@/components/ui-primitives/svgs/google-palm";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { integrations15Namespace } from "./config";
import type { IntegrationIcon, IntegrationPosition, IntegrationsBlock } from "./schema";

const ICON_REGISTRY: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  gemini: Gemini,
  replit: Replit,
  magicUi: MagicUI,
  vsCodium: VSCodium,
  mediaWiki: MediaWiki,
  googlePalm: GooglePaLM,
};

export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [, , tRoot] = useScopedT(integrations15Namespace);
  const headingId = `${props.id}-heading`;

  const left = props.spokes.filter((s) => s.position.startsWith("left-"));
  const right = props.spokes.filter((s) => s.position.startsWith("right-"));

  return (
    <section aria-labelledby={headingId}>
      <div className="bg-muted dark:bg-background py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative mx-auto flex max-w-sm items-center justify-between">
            <div className="space-y-6">
              {left.map((spoke, i) => {
                const Icon = ICON_REGISTRY[spoke.iconKey];
                return (
                  <SpokeCard key={i} position={spoke.position}>
                    <Icon />
                  </SpokeCard>
                );
              })}
            </div>
            <div className="mx-auto my-2 flex w-fit justify-center gap-2">
              <div className="bg-muted relative z-20 rounded-2xl border p-1">
                <SpokeCard
                  className="shadow-black-950/10 dark:bg-background size-16 border-black/25 shadow-xl dark:border-white/25 dark:shadow-white/10"
                  isCenter
                >
                  <LogoIcon />
                </SpokeCard>
              </div>
            </div>
            <div
              role="presentation"
              className="absolute inset-1/3 bg-[radial-gradient(var(--dots-color)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px] opacity-50 [--dots-color:black] dark:[--dots-color:white]"
            />

            <div className="space-y-6">
              {right.map((spoke, i) => {
                const Icon = ICON_REGISTRY[spoke.iconKey];
                return (
                  <SpokeCard key={i} position={spoke.position}>
                    <Icon />
                  </SpokeCard>
                );
              })}
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
            <h2
              id={headingId}
              className="text-3xl font-semibold text-balance md:text-4xl"
            >
              {tRoot(props.titleKey)}
            </h2>
            <p className="text-muted-foreground">{tRoot(props.bodyKey)}</p>

            <Button variant="outline" size="sm" asChild>
              <Link href={props.ctaHref}>{tRoot(props.ctaLabelKey)}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const SpokeCard = ({
  children,
  className,
  position,
  isCenter = false,
}: {
  children: ReactNode;
  className?: string;
  position?: IntegrationPosition;
  isCenter?: boolean;
}) => (
  <div
    className={cn(
      "bg-background relative flex size-12 rounded-xl border dark:bg-transparent",
      className,
    )}
  >
    <div className={cn("relative z-20 m-auto size-fit *:size-6", isCenter && "*:size-8")}>
      {children}
    </div>
    {position && !isCenter && (
      <div
        className={cn(
          "to-foreground/40 absolute z-10 h-px bg-linear-to-r from-transparent",
          position === "left-top" &&
            "top-1/2 left-full w-[130px] origin-left rotate-[25deg]",
          position === "left-middle" && "top-1/2 left-full w-[120px] origin-left",
          position === "left-bottom" &&
            "top-1/2 left-full w-[130px] origin-left rotate-[-25deg]",
          position === "right-top" &&
            "top-1/2 right-full w-[130px] origin-right rotate-[-25deg] bg-linear-to-l",
          position === "right-middle" &&
            "top-1/2 right-full w-[120px] origin-right bg-linear-to-l",
          position === "right-bottom" &&
            "top-1/2 right-full w-[130px] origin-right rotate-[25deg] bg-linear-to-l",
        )}
      />
    )}
  </div>
);
