import type { ComponentType, ReactNode, SVGProps } from "react";
import { Button } from "@/components/ui-primitives/button";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { InfiniteSlider } from "@/components/ui-effects/infinite-slider";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { GooglePaLM } from "@/components/ui-primitives/svgs/google-palm";
import { Linear } from "@/components/ui-primitives/svgs/linear";
import { MediaWiki } from "@/components/ui-primitives/svgs/media-wiki";
import { MistralAi } from "@/components/ui-primitives/svgs/mistral-ai";
import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { Vercel } from "@/components/ui-primitives/svgs/vercel";
import { VisualStudioCode as VSCode } from "@/components/ui-primitives/svgs/vs-code";
import { VSCodium } from "@/components/ui-primitives/svgs/vs-codium";
import { Windsurf } from "@/components/ui-primitives/svgs/windsurf";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { integrations06Namespace } from "./config";
import type { IntegrationIcon, IntegrationsBlock } from "./schema";

const ICONS: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  vsCode: VSCode,
  vsCodium: VSCodium,
  windsurf: Windsurf,
  claude: Claude,
  openai: OpenAI,
  mistralAi: MistralAi,
  mediaWiki: MediaWiki,
  gemini: Gemini,
  linear: Linear,
  vercel: Vercel,
  googlePalm: GooglePaLM,
  replit: Replit,
};

export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [, , tRoot] = useScopedT(integrations06Namespace);
  const ctaExternal = props.ctaHref.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`} className="bg-background py-24">
      <div className="group mx-auto max-w-5xl px-6 perspective-dramatic">
        <div className="group relative mx-auto max-w-2xl scale-y-90 rotate-x-6 items-center justify-between space-y-6 from-transparent mask-radial-[50%_90%] mask-radial-from-70% pb-1 transition-transform duration-1000 hover:scale-y-100 hover:rotate-x-0">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(var(--color-foreground)_1px,transparent_1px)] mask-radial-to-55% [background-size:16px_16px] opacity-25"
          />

          <div>
            <InfiniteSlider gap={56} speed={20} speedOnHover={10}>
              {props.rowTop.map((iconKey, index) => (
                <IntegrationCard key={`top-${index}`}>
                  <Icon iconKey={iconKey} />
                </IntegrationCard>
              ))}
            </InfiniteSlider>
          </div>

          <div>
            <InfiniteSlider gap={56} speed={20} speedOnHover={10} reverse>
              {props.rowMiddle.map((iconKey, index) => (
                <IntegrationCard key={`mid-${index}`}>
                  <Icon iconKey={iconKey} />
                </IntegrationCard>
              ))}
            </InfiniteSlider>
          </div>

          <div>
            <InfiniteSlider gap={56} speed={15} speedOnHover={10}>
              {props.rowBottom.map((iconKey, index) => (
                <IntegrationCard key={`bot-${index}`}>
                  <Icon iconKey={iconKey} />
                </IntegrationCard>
              ))}
            </InfiniteSlider>
          </div>

          <div className="absolute inset-0 m-auto flex size-fit -translate-y-3.5 justify-center gap-2">
            <IntegrationCard className="relative size-24 rounded-2xl border border-white/20 bg-zinc-700/50 shadow-xl ring-1 shadow-black/20 ring-black/50 backdrop-blur-lg">
              <LogoIcon className="text-white drop-shadow-sm" />
            </IntegrationCard>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-xl text-center">
          <h2
            id={`${props.id}-heading`}
            className="text-3xl font-semibold text-balance md:text-5xl"
          >
            {tRoot(props.headerTitleKey)}
          </h2>
          <p className="text-muted-foreground mt-4 mb-6 text-balance">
            {tRoot(props.headerBodyKey)}
          </p>

          <Button size="sm" asChild variant="outline">
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

function Icon({ iconKey }: { iconKey: IntegrationIcon }) {
  const SvgIcon = ICONS[iconKey];
  return <SvgIcon />;
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
      aria-hidden
      className={cn("bg-card relative z-20 flex size-20 rounded-xl border", className)}
    >
      <div className="m-auto size-fit *:size-8">{children}</div>
    </div>
  );
}
