import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { cta09Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

/** Plain card chrome — no baked padding/flex so the consumer's
 *  `p-8 md:p-12` overrides apply cleanly. */
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, , tRoot] = useScopedT(cta09Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <Card className="p-8 md:p-12">
          <div className="text-muted-foreground mb-6 text-sm font-medium">
            {tRoot(props.eyebrowKey)}
          </div>
          <h2 id={headingId} className="text-3xl font-medium text-balance md:text-4xl">
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md text-balance">
            {tRoot(props.bodyKey)}
          </p>
          <Button asChild className="mt-8 gap-2">
            <Link href={props.cta.href}>
              {tRoot(props.cta.labelKey)}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}
