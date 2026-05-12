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
import { integrations18Namespace } from "./config";
import type { IntegrationIcon, IntegrationsBlock } from "./schema";

const ICON_REGISTRY: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  gemini: Gemini,
  replit: Replit,
  magicUi: MagicUI,
  vsCodium: VSCodium,
  mediaWiki: MediaWiki,
  googlePalm: GooglePaLM,
};

/**
 * Tailark `integrations-5` — JSX verbatim. Two concentric orbital
 * rings: outer ring carries 3 integration cards (left / top / right),
 * inner ring carries 3 more (top / left / right), and a centered
 * `LogoIcon` tile sits at the bottom of the constellation. On hover
 * the rings reveal a slow spinning gradient sweep (lime + blue).
 * Title + body + outline CTA fade in from `bg-background` below.
 */
export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [, , tRoot] = useScopedT(integrations18Namespace);
  const headingId = `${props.id}-heading`;

  const [outerLeft, outerTop, outerRight] = props.outerRing;
  const [innerTop, innerLeft, innerRight] = props.innerRing;

  return (
    <section aria-labelledby={headingId}>
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="group relative mx-auto flex aspect-16/10 max-w-[22rem] items-center justify-between sm:max-w-sm">
            {/* Outer ring spinning sweep (lime), revealed on hover */}
            <div
              role="presentation"
              className="border-foreground/5 absolute inset-0 z-10 aspect-square animate-spin items-center justify-center rounded-full border-t bg-linear-to-b from-lime-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100 dark:from-white/5"
            />
            {/* Inner ring spinning sweep (blue), revealed on hover */}
            <div
              role="presentation"
              className="border-foreground/5 absolute inset-16 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t bg-linear-to-b from-blue-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100"
            />

            {/* Outer ring (3 cards) */}
            <div className="from-muted-foreground/15 absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t bg-linear-to-b to-transparent to-25%">
              <Card className="absolute top-1/4 left-0 -translate-x-1/6 -translate-y-1/4">
                <RenderIcon iconKey={outerLeft} />
              </Card>
              <Card className="absolute top-0 -translate-y-1/2">
                <RenderIcon iconKey={outerTop} />
              </Card>
              <Card className="absolute top-1/4 right-0 translate-x-1/6 -translate-y-1/4">
                <RenderIcon iconKey={outerRight} />
              </Card>
            </div>

            {/* Inner ring (3 cards) */}
            <div className="from-muted-foreground/15 absolute inset-16 flex aspect-square scale-90 items-center justify-center rounded-full border-t bg-linear-to-b to-transparent to-25%">
              <Card className="absolute top-0 -translate-y-1/2">
                <RenderIcon iconKey={innerTop} />
              </Card>
              <Card className="absolute top-1/4 left-0 -translate-x-1/4 -translate-y-1/4">
                <RenderIcon iconKey={innerLeft} />
              </Card>
              <Card className="absolute top-1/4 right-0 translate-x-1/4 -translate-y-1/4">
                <RenderIcon iconKey={innerRight} />
              </Card>
            </div>

            {/* Center LogoIcon tile pinned to the bottom */}
            <div className="absolute inset-x-0 bottom-0 mx-auto my-2 flex w-fit justify-center gap-2">
              <div className="bg-muted relative z-20 rounded-full border p-1">
                <Card
                  className="shadow-black-950/10 dark:bg-background size-16 border-black/20 shadow-xl dark:border-white/25 dark:shadow-white/15"
                  isCenter
                >
                  <LogoIcon className="text-blue-500" />
                </Card>
              </div>
            </div>
          </div>

          <div className="from-background relative z-20 mx-auto mt-12 max-w-lg space-y-6 bg-linear-to-t from-55% text-center">
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

const RenderIcon = ({ iconKey }: { iconKey: IntegrationIcon }) => {
  const Icon = ICON_REGISTRY[iconKey];
  return <Icon />;
};

const Card = ({
  children,
  className,
  isCenter = false,
}: {
  children: ReactNode;
  className?: string;
  isCenter?: boolean;
}) => (
  <div
    className={cn(
      "relative z-30 flex size-12 rounded-full border bg-white shadow-sm shadow-black/5 dark:bg-white/5 dark:backdrop-blur-md",
      className,
    )}
  >
    <div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>
      {children}
    </div>
  </div>
);
