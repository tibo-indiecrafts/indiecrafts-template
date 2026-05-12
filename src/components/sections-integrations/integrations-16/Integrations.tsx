import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { Button } from "@/components/ui-primitives/button";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { GooglePaLM } from "@/components/ui-primitives/svgs/google-palm";
import { MagicUI } from "@/components/ui-primitives/svgs/magic-ui";
import { VSCodium } from "@/components/ui-primitives/svgs/vs-codium";
import { MediaWiki } from "@/components/ui-primitives/svgs/media-wiki";
import { useScopedT } from "@/i18n/scoped-t";
import { integrations16Namespace } from "./config";
import type { IntegrationIcon, IntegrationsBlock } from "./schema";

const ICON_REGISTRY: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  gemini: Gemini,
  replit: Replit,
  googlePalm: GooglePaLM,
  magicUi: MagicUI,
  vsCodium: VSCodium,
  mediaWiki: MediaWiki,
};

/**
 * Tailark `integrations-8` — JSX verbatim. 2-column layout (`md:grid-cols-2`)
 * on `bg-muted dark:bg-background py-24 md:py-32`. Left column: title +
 * body + outline CTA + a testimonial block (square branded icon tile +
 * blockquote with author/role). Right column: a top-radial-masked card
 * holding a 2-col grid of 6 integration cells (icon + name + description,
 * with `hover:bg-muted` interaction).
 */
export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [, , tRoot] = useScopedT(integrations16Namespace);
  const headingId = `${props.id}-heading`;
  const TestimonialIcon = ICON_REGISTRY[props.testimonial.iconKey];

  return (
    <section aria-labelledby={headingId}>
      <div className="bg-muted dark:bg-background py-24 md:py-32">
        <div className="mx-auto flex flex-col px-6 md:grid md:max-w-5xl md:grid-cols-2 md:gap-12">
          <div className="order-last mt-6 flex flex-col gap-12 md:order-first">
            <div className="space-y-6">
              <h2
                id={headingId}
                className="text-3xl font-semibold text-balance md:text-4xl lg:text-5xl"
              >
                {tRoot(props.titleKey)}
              </h2>
              <p className="text-muted-foreground">{tRoot(props.bodyKey)}</p>
              <Button variant="outline" size="sm" asChild>
                <Link href={props.ctaHref}>{tRoot(props.ctaLabelKey)}</Link>
              </Button>
            </div>

            <div className="mt-auto grid grid-cols-[auto_1fr] gap-3">
              <div className="bg-background flex aspect-square items-center justify-center border">
                <TestimonialIcon className="size-9" />
              </div>
              <blockquote>
                <p>{tRoot(props.testimonial.quoteKey)}</p>
                <div className="mt-2 flex gap-2 text-sm">
                  <cite>{tRoot(props.testimonial.authorKey)}</cite>
                  <p className="text-muted-foreground">
                    {tRoot(props.testimonial.roleKey)}
                  </p>
                </div>
              </blockquote>
            </div>
          </div>

          <div className="-mx-6 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)] px-6 sm:mx-auto sm:max-w-md md:-mx-6 md:mr-0 md:ml-auto">
            <div className="bg-background dark:bg-muted/50 rounded-2xl border p-3 shadow-lg md:pb-12">
              <div className="grid grid-cols-2 gap-2">
                {props.cells.map((cell, index) => {
                  const Icon = ICON_REGISTRY[cell.iconKey];
                  return (
                    <Cell
                      key={index}
                      icon={<Icon className="size-6" />}
                      name={tRoot(cell.nameKey)}
                      description={tRoot(cell.descriptionKey)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Cell = ({
  icon,
  name,
  description,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
}) => (
  <div className="hover:bg-muted dark:hover:bg-muted/50 space-y-4 rounded-lg border p-4 transition-colors">
    <div className="flex size-fit items-center justify-center">{icon}</div>
    <div className="space-y-1">
      <h3 className="text-sm font-medium">{name}</h3>
      <p className="text-muted-foreground line-clamp-1 text-sm md:line-clamp-2">
        {description}
      </p>
    </div>
  </div>
);
