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
import { integrations17Namespace } from "./config";
import type { IntegrationIcon, IntegrationsBlock } from "./schema";

const ICON_REGISTRY: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  gemini: Gemini,
  replit: Replit,
  magicUi: MagicUI,
  vsCodium: VSCodium,
  mediaWiki: MediaWiki,
  googlePalm: GooglePaLM,
};

export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [, , tRoot] = useScopedT(integrations17Namespace);
  const headingId = `${props.id}-heading`;

  const renderRow = (icons: readonly IntegrationIcon[]) =>
    icons.map((iconKey, i) => {
      const Icon = ICON_REGISTRY[iconKey];
      return (
        <Card key={i}>
          <Icon />
        </Card>
      );
    });

  return (
    <section aria-labelledby={headingId}>
      <div className="bg-muted dark:bg-background py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center sm:grid-cols-2">
            <div className="dark:bg-muted/50 relative mx-auto w-fit">
              <div
                aria-hidden
                className="to-muted dark:to-background absolute inset-0 z-10 bg-radial from-transparent to-75%"
              />
              <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
                {renderRow(props.topRow)}
              </div>
              <div className="mx-auto my-2 flex w-fit justify-center gap-2">
                {(() => {
                  const FirstIcon = ICON_REGISTRY[props.middleRow[0]];
                  const SecondIcon = ICON_REGISTRY[props.middleRow[1]];
                  return (
                    <>
                      <Card>
                        <FirstIcon />
                      </Card>
                      <Card
                        borderClassName="shadow-black-950/10 shadow-xl border-black/25 dark:border-white/25"
                        className="dark:bg-white/10"
                      >
                        <LogoIcon />
                      </Card>
                      <Card>
                        <SecondIcon />
                      </Card>
                    </>
                  );
                })()}
              </div>
              <div className="mx-auto flex w-fit justify-center gap-2">
                {renderRow(props.bottomRow)}
              </div>
            </div>
            <div className="mx-auto mt-6 max-w-lg space-y-6 text-center sm:mt-0 sm:text-left">
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
      </div>
    </section>
  );
}

const Card = ({
  children,
  className,
  borderClassName,
}: {
  children: ReactNode;
  className?: string;
  borderClassName?: string;
}) => (
  <div
    className={cn(
      "bg-background relative flex size-20 rounded-xl dark:bg-transparent",
      className,
    )}
  >
    <div
      role="presentation"
      className={cn(
        "absolute inset-0 rounded-xl border border-black/20 dark:border-white/25",
        borderClassName,
      )}
    />
    <div className="relative z-20 m-auto size-fit *:size-8">{children}</div>
  </div>
);
