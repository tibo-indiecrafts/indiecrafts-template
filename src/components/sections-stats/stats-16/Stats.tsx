import type { ReactNode } from "react";
import { Map } from "@/components/ui-illustrations/dark-landing-dotted-map";
import { useScopedT } from "@/i18n/scoped-t";
import { stats16Namespace } from "./config";
import type { StatsBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <span className="text-foreground font-medium">{chunks}</span>
  ),
};

export default function Stats(props: Readonly<StatsBlock>) {
  const [, , tRoot] = useScopedT(stats16Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="bg-background">
      <h2 id={`${props.id}-heading`} className="sr-only">
        Platform stats
      </h2>
      <div className="@container py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mask-t-from-35% mask-b-from-75%">
            <Map />
          </div>
          <div className="relative mx-auto max-w-3xl">
            <span
              aria-hidden
              className="bg-border pointer-events-none absolute inset-y-4 left-1/3 hidden w-px @2xl:block"
            />
            <span
              aria-hidden
              className="bg-border pointer-events-none absolute inset-y-4 left-2/3 hidden w-px @2xl:block"
            />
            <div className="grid *:px-6 **:text-center @max-2xl:mx-auto @max-2xl:max-w-2xs @max-2xl:gap-6 @2xl:grid-cols-3">
              {props.items.map((item, index) => (
                <div key={index} className="space-y-4 *:block">
                  <span className="text-3xl font-semibold">
                    {tRoot(item.valueKey)}
                    {item.suffixKey ? (
                      <>
                        {" "}
                        <span className="text-muted-foreground text-lg">
                          {tRoot(item.suffixKey)}
                        </span>
                      </>
                    ) : null}
                  </span>
                  <p className="text-muted-foreground text-sm text-balance">
                    {tRoot.rich(item.bodyKey, RICH_STRONG)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
