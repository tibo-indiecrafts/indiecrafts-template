import { Card, CardContent } from "@/components/ui-primitives/card";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { stats01Items, stats01Namespace } from "./config";
import type { StatsBlock } from "./schema";

/**
 * Joined-card row of metric tiles with positive/negative change
 * deltas. Sourced from `@blocks-so/stats-01`.
 */
export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats01Namespace);
  const items = props.items ?? stats01Items;
  const titleId = `${props.id}-title`;

  return (
    <section aria-labelledby={titleId} className="flex items-center justify-center p-10">
      <h2 id={titleId} className="sr-only">
        {tr(props.titleKey, "title")}
      </h2>
      <div className="bg-border mx-auto grid grid-cols-1 gap-px rounded-xl sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className={cn(
              "rounded-none border-0 py-0 shadow-none",
              index === 0 && "rounded-l-xl",
              index === items.length - 1 && "rounded-r-xl",
            )}
          >
            <CardContent className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 p-4 sm:p-6">
              <div className="text-muted-foreground text-sm font-medium">
                {t(`items.${item.id}.name`)}
              </div>
              <div
                className={cn(
                  "text-xs font-medium tabular-nums",
                  item.changeType === "positive"
                    ? "text-green-800 dark:text-green-400"
                    : "text-red-800 dark:text-red-400",
                )}
              >
                {item.change}
              </div>
              <div className="text-foreground w-full flex-none text-3xl font-medium tracking-tight tabular-nums">
                {item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
