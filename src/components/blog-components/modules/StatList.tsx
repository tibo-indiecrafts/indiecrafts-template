import type { StatListModule } from "@/sanity/types";
import { cn } from "@/lib/utils";

/**
 * Stats module — design ported from `sections-stats/stats-01`: a rounded
 * card grid with hairline dividers (one-pixel border background showing
 * through the gap between cells). Each cell shows the label on top,
 * value below in tabular numerals. Adapted from the library's design
 * which also had a change indicator; we don't track change so it's
 * omitted.
 */
export function StatList(props: StatListModule) {
  if (!props.stats?.length) return null;
  const stats = props.stats;
  return (
    <section id={props.anchor} className="mx-auto max-w-6xl px-(--gutter) py-8 md:py-12">
      <dl
        className={cn(
          "bg-border grid grid-cols-1 gap-px overflow-hidden rounded-xl sm:grid-cols-2",
          stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        )}
      >
        {stats.map((stat) => (
          <div
            key={stat._key}
            className="bg-card flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 p-4 sm:p-6"
          >
            {stat.label ? (
              <dt className="text-muted-foreground text-sm font-medium">{stat.label}</dt>
            ) : null}
            <dd className="text-foreground w-full flex-none text-3xl font-medium tracking-tight tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
