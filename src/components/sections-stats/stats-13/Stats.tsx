"use client";

import { Card, CardContent } from "@/components/ui-primitives/card";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { stats13Namespace, stats13Sample, stats13Segments } from "./config";
import type { StatsBlock } from "./schema";

/**
 * Segmented storage progress bar with per-segment legend and a
 * "Free" remainder. Sourced from `@blocks-so/stats-13`.
 */
export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats13Namespace);
  const titleId = `${props.id}-title`;
  const used = props.used ?? stats13Sample.used!;
  const total = props.total ?? stats13Sample.total!;
  const usedUnit = props.usedUnit ?? stats13Sample.usedUnit!;
  const totalUnit = props.totalUnit ?? stats13Sample.totalUnit!;
  const segments = props.segments ?? stats13Segments;
  const totalValue = total * 1000;
  const freeValue = totalValue - used;

  return (
    <section aria-labelledby={titleId}>
      <Card className="w-full max-w-4xl shadow-sm">
        <CardContent className="py-0">
          <p id={titleId} className="text-muted-foreground mb-4 text-base text-pretty">
            {tr(props.titleKey, "title")}{" "}
            <span className="text-foreground font-semibold tabular-nums">
              {used.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}{" "}
              {usedUnit}
            </span>{" "}
            {t("ofTotal", { total, totalUnit })}
          </p>

          <div className="bg-muted mb-4 flex h-2.5 w-full overflow-hidden rounded-full">
            {segments.map((segment) => {
              const percentage = (segment.value / totalValue) * 100;
              const label = t(`segments.${segment.id}.label`);
              return (
                <div
                  key={segment.id}
                  className={cn("h-full", segment.color)}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-label={label}
                  aria-valuenow={segment.value}
                  aria-valuemin={0}
                  aria-valuemax={totalValue}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {segments.map((segment) => (
              <div key={segment.id} className="flex items-center gap-2">
                <span
                  className={cn("size-3 shrink-0 rounded", segment.color)}
                  aria-hidden="true"
                />
                <span className="text-muted-foreground text-sm">
                  {t(`segments.${segment.id}.label`)}
                </span>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {Math.round(segment.value)}
                  {usedUnit}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="bg-muted size-3 shrink-0 rounded-sm" aria-hidden="true" />
              <span className="text-muted-foreground text-sm">{t("free")}</span>
              <span className="text-muted-foreground text-sm tabular-nums">
                {Math.round(freeValue)}
                {usedUnit}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
