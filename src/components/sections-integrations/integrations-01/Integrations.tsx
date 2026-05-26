import type { ComponentType, SVGProps } from "react";
import { Card } from "@/components/ui-primitives/card";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { GooglePaLM } from "@/components/ui-primitives/svgs/google-palm";
import { MediaWiki } from "@/components/ui-primitives/svgs/media-wiki";
import { MistralAi } from "@/components/ui-primitives/svgs/mistral-ai";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { VSCodium } from "@/components/ui-primitives/svgs/vs-codium";
import { useScopedT } from "@/components/_lib/scoped-t";
import { integrations01Namespace } from "./config";
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
    <section aria-labelledby={`${props.id}-heading`} className="bg-background py-24">
      <h2 id={`${props.id}-heading`} className="sr-only">
        Integrations
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {props.cards.map((card, index) => (
            <IntegrationCardItem key={index} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function IntegrationCardItem({ card }: Readonly<{ card: IntegrationCardData }>) {
  const [, , tRoot] = useScopedT(integrations01Namespace);
  const Icon = ICONS[card.iconKey];
  const external = card.href.startsWith("http");

  return (
    <Card className="relative gap-0 p-6">
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
    </Card>
  );
}
