import * as React from "react";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { stats18Namespace } from "./config";
import type { StatsBlock } from "./schema";

/** Lightweight Card replacement matching Tailark's flat card —
 *  rounded chrome only, no baked padding/border/shadow/flex so the
 *  consumer's `grid divide-*` classes apply cleanly. */
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-background rounded-xl border", className)} {...props} />
);

/**
 * Tailark `mist-stats-1` — JSX verbatim. Single-card 3-stat row on
 * `bg-muted py-12 md:py-20`. The card uses `grid gap-0.5 divide-y`
 * with `md:grid-cols-3 md:divide-x md:divide-y-0` so dividers swap
 * orientation with the breakpoint. Each cell has `py-8 text-center`,
 * a `text-4xl font-bold` value, and a muted body label.
 */
export default function Stats(props: Readonly<StatsBlock>) {
  const [, , tRoot] = useScopedT(stats18Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-muted py-12 md:py-20">
      <h2 id={headingId} className="sr-only">
        Tailark stats
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <Card className="grid gap-0.5 divide-y *:py-8 *:text-center md:grid-cols-3 md:divide-x md:divide-y-0">
          {props.items.map((item, index) => (
            <div key={index}>
              <div className="text-foreground space-y-1 text-4xl font-bold">
                {tRoot(item.valueKey)}
              </div>
              <p className="text-muted-foreground">{tRoot(item.bodyKey)}</p>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
