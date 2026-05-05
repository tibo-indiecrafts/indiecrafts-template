import { Badge } from "@/components/ui-primitives/badge";
import { Card, CardContent } from "@/components/ui-primitives/card";
import { useScopedT } from "@/i18n/scoped-t";
import { stats14Items, stats14Namespace, stats14Sample } from "./config";
import type { StatsBlock } from "./schema";

const colorClasses: Record<"emerald" | "amber" | "rose", string> = {
  emerald: "bg-emerald-500 dark:bg-emerald-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  rose: "bg-rose-500 dark:bg-rose-400",
};

/**
 * Single usage card with stacked resource breakdown bar +
 * per-resource legend list. Sourced from `@blocks-so/stats-14`.
 */
export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats14Namespace);
  const items = props.items ?? stats14Items;
  const titleId = `${props.id}-title`;
  const total = props.total ?? stats14Sample.total!;
  const change = props.change ?? stats14Sample.change!;
  const settingsHref = props.settingsHref ?? "#";

  return (
    <section aria-labelledby={titleId}>
      <Card className="w-full max-w-sm shadow-none">
        <CardContent className="flex flex-col justify-between pt-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 id={titleId} className="text-foreground text-sm font-bold text-balance">
                {tr(props.titleKey, "title")}
              </h3>
              <Badge
                variant="secondary"
                className="bg-amber-50 text-amber-700 ring-1 ring-amber-500/30 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20"
              >
                {change}
              </Badge>
            </div>

            <p className="mt-2 flex items-baseline gap-2 text-pretty">
              <span className="text-foreground text-xl">{total}</span>
              <span className="text-muted-foreground text-sm">{t("thisMonth")}</span>
            </p>

            <div className="mt-4">
              <p className="text-foreground text-sm font-medium text-pretty">
                {t("breakdownLabel")}
              </p>
              <div className="mt-2 flex items-center gap-0.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`${colorClasses[item.color]} h-1.5 rounded-xs`}
                    style={{ width: `${item.percentage}%` }}
                  />
                ))}
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-xs">
                  <span
                    className={`${colorClasses[item.color]} size-2.5 rounded-xs`}
                    aria-hidden="true"
                  />
                  <span className="text-foreground">{t(`items.${item.id}.label`)}</span>
                  <span className="text-muted-foreground">
                    {t("amountFormat", {
                      amount: item.amount,
                      percentage: item.percentage,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-muted-foreground mt-6 text-xs text-pretty">
            {t("configurePrefix")}{" "}
            <a
              href={settingsHref}
              className="text-emerald-600 hover:underline dark:text-emerald-400"
            >
              {t("settingsLink")}
            </a>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
