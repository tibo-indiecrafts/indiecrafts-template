import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { GooglePaLM } from "@/components/ui-primitives/svgs/google-palm";
import { useScopedT } from "@/i18n/scoped-t";
import { integrations14Namespace } from "./config";
import type { IntegrationIcon, IntegrationsBlock } from "./schema";

const ICON_REGISTRY: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  gemini: Gemini,
  replit: Replit,
  googlePalm: GooglePaLM,
};

/**
 * Tailark `integrations-6` — JSX verbatim. Stacked LLM-integration
 * row card masked by a top-radial gradient on `bg-muted dark:bg-background`,
 * with a centered title + body + outline CTA below. Each row carries
 * a brand SVG, name, description, and a square outline `Plus` button
 * for the "Add integration" affordance.
 */
export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [, , tRoot] = useScopedT(integrations14Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="bg-muted dark:bg-background py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-md [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)] px-6">
            <div className="bg-background dark:bg-muted/50 rounded-xl border px-6 pt-3 pb-12 shadow-xl">
              {props.rows.map((row, index) => {
                const Icon = ICON_REGISTRY[row.iconKey];
                return (
                  <Row
                    key={index}
                    icon={<Icon className="size-6" />}
                    name={tRoot(row.nameKey)}
                    description={tRoot(row.descriptionKey)}
                    addLabel={tRoot("blocks.integrations-14.rowAddAriaLabel")}
                  />
                );
              })}
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-lg space-y-6 text-center">
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
        </div>
      </div>
    </section>
  );
}

const Row = ({
  icon,
  name,
  description,
  addLabel,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  addLabel: string;
}) => (
  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-dashed py-3 last:border-b-0">
    <div className="bg-muted border-foreground/5 flex size-12 items-center justify-center rounded-lg border">
      {icon}
    </div>
    <div className="space-y-0.5">
      <h3 className="text-sm font-medium">{name}</h3>
      <p className="text-muted-foreground line-clamp-1 text-sm">{description}</p>
    </div>
    <Button variant="outline" size="icon" aria-label={addLabel}>
      <Plus className="size-4" />
    </Button>
  </div>
);
