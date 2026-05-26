import * as React from "react";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/components/_lib/scoped-t";
import { stats18Namespace } from "./config";
import type { StatsBlock } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-background rounded-xl border", className)} {...props} />
);

export default function Stats(props: Readonly<StatsBlock>) {
  const [, , tRoot] = useScopedT(stats18Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-muted py-12 md:py-20">
      <h2 id={headingId} className="sr-only">
        Acme stats
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
