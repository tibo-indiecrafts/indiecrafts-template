import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { stats15Items, stats15Namespace } from "./config";
import type { ProjectionBlock } from "./schema";

/**
 * Investment growth projection list (1y / 5y / 10y rows) with value
 * and percentage badge per row. Sourced from `@blocks-so/stats-15`.
 */
export default function Projection(props: Readonly<ProjectionBlock>) {
  const [t, tr] = useScopedT(stats15Namespace);
  const items = props.items ?? stats15Items;
  const titleId = `${props.id}-title`;

  return (
    <section aria-labelledby={titleId} className="w-full max-w-2xs">
      <h3 id={titleId} className="text-foreground text-sm font-medium text-balance">
        {tr(props.titleKey, "title")}
      </h3>
      <ul className="divide-border mt-2 divide-y text-sm">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-3">
            <span className="text-muted-foreground">{t(`items.${item.id}.label`)}</span>
            <span className="flex items-center gap-3 tabular-nums">
              <span className="text-foreground text-right font-medium">{item.value}</span>
              <span className="bg-border h-5 w-px" aria-hidden="true" />
              <span
                className={cn(
                  "w-15 rounded px-1.5 py-1 text-center text-xs font-semibold",
                  "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
                )}
              >
                {item.percentage}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
