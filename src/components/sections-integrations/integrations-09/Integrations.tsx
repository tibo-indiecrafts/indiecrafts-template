import type { ComponentType, ReactNode, SVGProps } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Cloudflare } from "@/components/ui-primitives/svgs/cloudflare";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { IntelliJIDEA } from "@/components/ui-primitives/svgs/intellij";
import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";
import { Vercel } from "@/components/ui-primitives/svgs/vercel";
import { VisualStudioCode as VSCode } from "@/components/ui-primitives/svgs/vs-code";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { integrations09Namespace } from "./config";
import type {
  IntegrationIcon,
  IntegrationsBlock,
  IntegrationsGroup as IntegrationsGroupData,
} from "./schema";

const ICONS: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  intellij: IntelliJIDEA,
  vsCode: VSCode,
  openai: OpenAI,
  claude: Claude,
  gemini: Gemini,
  cloudflare: Cloudflare,
  vercel: Vercel,
};

export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [, , tRoot] = useScopedT(integrations09Namespace);
  const ctaExternal = props.ctaHref.startsWith("http");

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2
            id={`${props.id}-heading`}
            className="text-3xl font-semibold text-balance md:text-5xl md:tracking-tight"
          >
            {tRoot(props.headerTitleKey)}
          </h2>
          <p className="text-muted-foreground mt-4 mb-6 text-lg text-balance">
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

        <div className="relative mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-4 @max-xl:max-w-xs @xl:grid-cols-9">
          <div
            aria-hidden
            className="absolute inset-x-0 inset-y-4 m-auto bg-[linear-gradient(to_right,var(--color-foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-foreground)_1px,transparent_1px)] mask-radial-to-85% bg-[size:12px_12px] opacity-5"
          />
          <div
            aria-hidden
            className="absolute inset-x-6 inset-y-4 m-auto translate-[0.5px] bg-[radial-gradient(var(--color-foreground)_1px,transparent_1px)] mask-radial-to-85% [background-size:24px_24px] opacity-25"
          />

          <IntegrationsGroupCard
            group={props.groups[0]}
            className="@max-xl:row-start-3"
          />

          <div aria-hidden className="@max-xl:hidden" />

          <IntegrationsGroupCard
            group={props.groups[1]}
            className="col-span-3 @max-xl:col-span-4 @max-xl:row-start-1 @max-xl:w-3/4 @max-xl:place-self-center"
          />

          <div aria-hidden className="@max-xl:hidden" />

          <IntegrationsGroupCard group={props.groups[2]} />
        </div>
      </div>
    </section>
  );
}

function IntegrationsGroupCard({
  group,
  className,
}: {
  group: IntegrationsGroupData;
  className?: string;
}) {
  const [, , tRoot] = useScopedT(integrations09Namespace);
  const cols = group.iconsPerRow ?? 2;

  return (
    <div
      className={cn(
        "ring-foreground/5 bg-foreground/3 relative z-20 col-span-2 row-span-2 grid grid-rows-subgrid gap-1.5 self-center rounded-2xl border border-transparent p-2 shadow ring-1 backdrop-blur",
        className,
      )}
    >
      <span className="text-muted-foreground block self-center text-center text-sm text-balance">
        {tRoot(group.labelKey)}
      </span>
      <div className={cn("grid gap-2", cols === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {group.icons.map((iconKey, index) => {
          const Icon = ICONS[iconKey];
          return (
            <IntegrationCard key={index}>
              <Icon className={iconKey === "cloudflare" ? "!w-7" : undefined} />
            </IntegrationCard>
          );
        })}
      </div>
    </div>
  );
}

function IntegrationCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-card ring-foreground/10 flex aspect-square size-full rounded-lg border border-transparent shadow ring-1 *:m-auto *:size-5">
      {children}
    </div>
  );
}
