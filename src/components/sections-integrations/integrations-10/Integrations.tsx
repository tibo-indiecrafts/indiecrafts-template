import type { ComponentType, ReactNode, SVGProps } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Cloudflare } from "@/components/ui-primitives/svgs/cloudflare";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { GooglePaLM } from "@/components/ui-primitives/svgs/google-palm";
import { Linear } from "@/components/ui-primitives/svgs/linear";
import { MediaWiki } from "@/components/ui-primitives/svgs/media-wiki";
import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { Vercel } from "@/components/ui-primitives/svgs/vercel";
import { VisualStudioCode as VSCode } from "@/components/ui-primitives/svgs/vs-code";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { integrations10Namespace } from "./config";
import type { IntegrationIcon, IntegrationsBlock } from "./schema";

const ICONS: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  mediaWiki: MediaWiki,
  replit: Replit,
  vercel: Vercel,
  linear: Linear,
  vsCode: VSCode,
  openai: OpenAI,
  cloudflare: Cloudflare,
  claude: Claude,
  gemini: Gemini,
  googlePalm: GooglePaLM,
};

export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [, , tRoot] = useScopedT(integrations10Namespace);
  const ctaExternal = props.ctaHref.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`} className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div aria-hidden className="space-y-3">
          {props.rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={cn(
                "flex justify-center gap-3",
                row.reverse && "flex-row-reverse",
              )}
            >
              {row.cells.map((cell, cellIndex) => {
                if (cell === null) {
                  return <EmptySlot key={cellIndex} />;
                }
                const Icon = ICONS[cell];
                return (
                  <IntegrationCard key={cellIndex}>
                    <Icon className="size-6" />
                  </IntegrationCard>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-lg text-center">
          <h2
            id={`${props.id}-heading`}
            className="text-3xl font-semibold text-balance md:text-4xl"
          >
            {tRoot(props.headerTitleKey)}
          </h2>
          <p className="text-muted-foreground mt-4 mb-6 text-balance">
            {tRoot(props.headerBodyKey)}
          </p>
          <Button variant="outline" size="sm" asChild>
            <a
              href={props.ctaHref}
              target={ctaExternal ? "_blank" : undefined}
              rel={ctaExternal ? "noopener noreferrer" : undefined}
            >
              {tRoot(props.ctaLabelKey)}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function IntegrationCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-card ring-foreground/10 flex aspect-square size-11 rounded-full border border-transparent shadow-md ring-1 *:m-auto *:size-5">
      {children}
    </div>
  );
}

function EmptySlot() {
  return <div className="bg-foreground/3 size-11 rounded-full border" />;
}
