import type { ComponentType } from "react";
import { MessageIllustration } from "@/components/ui-illustrations/message-illustration";
import { PollIllustration } from "@/components/ui-illustrations/poll-illustration";
import { UptimeIllustration } from "@/components/ui-illustrations/uptime-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { features15Namespace } from "./config";
import type { FeaturesBlock, FeaturesIllustration } from "./schema";

const ILLUSTRATIONS: Record<FeaturesIllustration, ComponentType> = {
  message: MessageIllustration,
  uptime: UptimeIllustration,
  poll: PollIllustration,
};

const ILLUSTRATION_WRAPPER_CLASS: Record<FeaturesIllustration, string> = {
  message: "mx-auto max-w-56 self-center",
  uptime: "self-center",
  poll: "mx-auto self-center",
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features15Namespace);

  return (
    <section
      aria-labelledby={props.titleKey ? `${props.id}-title` : undefined}
      className="bg-background @container py-24"
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
        <div className="ring-border bg-card/50 mx-auto overflow-hidden rounded-2xl border border-transparent shadow-md ring-1 shadow-black/5 @max-4xl:max-w-sm">
          <div className="grid @max-4xl:divide-y @4xl:grid-cols-3 @4xl:divide-x">
            {props.items.map((item, i) => {
              const Illustration = ILLUSTRATIONS[item.illustration];
              return (
                <div key={i} className="row-span-2 grid grid-rows-subgrid gap-8 p-8">
                  <div className={ILLUSTRATION_WRAPPER_CLASS[item.illustration]}>
                    <Illustration />
                  </div>
                  <div className="relative z-10 mx-auto max-w-sm text-center">
                    <h3 className="font-semibold text-balance">{tRoot(item.titleKey)}</h3>
                    <p className="text-muted-foreground mt-3 text-balance">
                      {tRoot(item.bodyKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
