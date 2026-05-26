import type { ComponentType } from "react";
import { IntegrationsIllustration } from "@/components/ui-illustrations/integrations-illustration";
import { MessageIllustration } from "@/components/ui-illustrations/message-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features14Namespace } from "./config";
import type { FeaturesBlock, FeaturesIllustration } from "./schema";

const ILLUSTRATIONS: Record<FeaturesIllustration, ComponentType> = {
  message: MessageIllustration,
  integrations: IntegrationsIllustration,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features14Namespace);

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
        <div className="ring-border bg-card/50 relative grid overflow-hidden rounded-2xl border border-transparent shadow-md ring-1 shadow-black/5 @max-4xl:divide-y @4xl:grid-cols-2 @4xl:divide-x">
          {props.items.map((item, i) => {
            const Illustration = ILLUSTRATIONS[item.illustration];
            const isIntegrations = item.illustration === "integrations";
            return (
              <div key={i} className="row-span-2 grid grid-rows-subgrid gap-8 p-8">
                <div
                  className={
                    isIntegrations
                      ? "mx-auto max-w-sm @4xl:px-8"
                      : "mx-auto max-w-xs self-center"
                  }
                >
                  <Illustration />
                </div>
                <div
                  className={
                    isIntegrations
                      ? "relative z-10 mx-auto max-w-sm text-center"
                      : "mx-auto max-w-sm text-center"
                  }
                >
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
    </section>
  );
}
