import type { ComponentType, SVGProps } from "react";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { GooglePaLM } from "@/components/ui-primitives/svgs/google-palm";
import { MediaWiki } from "@/components/ui-primitives/svgs/media-wiki";
import { MistralAi } from "@/components/ui-primitives/svgs/mistral-ai";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { VSCodium } from "@/components/ui-primitives/svgs/vs-codium";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { integrations02Namespace } from "./config";
import type {
  IntegrationCard as IntegrationCardData,
  IntegrationIcon,
  IntegrationsBlock,
} from "./schema";

const ICONS: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  gemini: Gemini,
  replit: Replit,
  mistralAi: MistralAi,
  vsCodium: VSCodium,
  mediaWiki: MediaWiki,
  googlePalm: GooglePaLM,
};

export default function Integrations(props: Readonly<IntegrationsBlock>) {
  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Integrations
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative">
          <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 bottom-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <div className="grid divide-y border @max-2xl:*:nth-2:border-r-0 @max-2xl:*:nth-4:border-r-0 @md:grid-cols-2 @md:divide-x @md:*:nth-5:border-b-0 @2xl:grid-cols-3 @2xl:*:nth-3:border-r-0 @2xl:*:nth-4:border-b-0">
            {props.cards.map((card, index) => (
              <IntegrationCardItem key={index} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IntegrationCardItem({ card }: Readonly<{ card: IntegrationCardData }>) {
  const [, , tRoot] = useScopedT(integrations02Namespace);
  const Icon = ICONS[card.iconKey];
  const external = card.href.startsWith("http");

  return (
    <div className="hover:bg-foreground/3 relative p-6">
      <div className="flex h-8 items-start *:size-8">
        <Icon />
      </div>
      <div className="space-y-2 pt-6">
        <h3 className="text-base font-medium">
          <a
            href={card.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="before:absolute before:inset-0"
          >
            {tRoot(card.titleKey)}
          </a>
        </h3>
        <p className="text-muted-foreground line-clamp-2">{tRoot(card.bodyKey)}</p>
      </div>
    </div>
  );
}

function PlusDecorator({ className }: { className?: string }) {
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
