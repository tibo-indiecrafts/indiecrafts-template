import { ChartBarStacked, MessageCircle, Vote, type LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { MessageIllustration } from "@/components/ui-illustrations/message-illustration";
import { PollIllustration } from "@/components/ui-illustrations/poll-illustration";
import { UptimeIllustration } from "@/components/ui-illustrations/uptime-illustration";
import { Card } from "@/components/ui-primitives/card";
import { useScopedT } from "@/i18n/scoped-t";
import { features21Namespace } from "./config";
import type { CardIcon, CardIllustration, FeaturesBlock } from "./schema";

const ICONS: Record<CardIcon, LucideIcon> = {
  messageCircle: MessageCircle,
  chartBar: ChartBarStacked,
  vote: Vote,
};

const ILLUSTRATIONS: Record<CardIllustration, ComponentType> = {
  message: MessageIllustration,
  uptime: UptimeIllustration,
  poll: PollIllustration,
};

const ILLUSTRATION_WRAPPER_CLASS: Record<CardIllustration, string> = {
  message: "",
  uptime: "mt-6 w-full",
  poll: "w-full px-2",
};

const RICH_BODY = {
  strong: (chunks: ReactNode) => (
    <span className="text-foreground font-medium">{chunks}</span>
  ),
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features21Namespace);

  return (
    <section
      aria-labelledby={props.titleKey ? `${props.id}-title` : undefined}
      className="@container py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-(--gutter)">
        {props.titleKey ? (
          <div className="mb-12 text-center">
            <h2
              id={`${props.id}-title`}
              className="text-4xl font-semibold text-balance lg:text-5xl"
            >
              {tr(props.titleKey, "title")}
            </h2>
            {props.bodyKey ? (
              <p className="text-muted-foreground mt-4">{tr(props.bodyKey, "body")}</p>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-3 *:p-6 @max-4xl:mx-auto @max-4xl:max-w-sm @4xl:grid-cols-3">
          {props.cards.map((card, i) => {
            const Icon = ICONS[card.iconKey];
            const Illustration = ILLUSTRATIONS[card.illustration];
            return (
              <Card
                key={i}
                className="bg-card/50 grid grid-rows-[auto_1fr] space-y-12 overflow-hidden"
              >
                <div>
                  <Icon className="fill-foreground/10 mb-5 size-4" aria-hidden="true" />
                  <h3 className="text-foreground text-lg font-semibold">
                    {tRoot(card.titleKey)}
                  </h3>
                  <p className="text-muted-foreground mt-3">
                    {tRoot.rich(card.bodyKey, RICH_BODY)}
                  </p>
                </div>
                <div className="relative -m-8 flex flex-col items-end justify-center p-8">
                  <div className={ILLUSTRATION_WRAPPER_CLASS[card.illustration]}>
                    <Illustration />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
