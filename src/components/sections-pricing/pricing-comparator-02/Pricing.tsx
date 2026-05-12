import * as React from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { pricingComparator02Namespace } from "./config";
import type { ComparatorRow, PricingBlock } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

export default function Pricing(props: Readonly<PricingBlock>) {
  const [, , tRoot] = useScopedT(pricingComparator02Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h2 id={headingId} className="text-4xl font-medium text-balance">
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            {tRoot(props.bodyKey)}
          </p>
        </div>
        <Card className="mt-12 overflow-auto @max-md:*:min-w-md">
          <div className="grid grid-cols-3">
            <div className="p-4" />
            <div className="min-w-32 border-l p-4 text-center">
              <p className="text-foreground font-medium">{tRoot(props.free.nameKey)}</p>
              <p className="text-2xl font-medium">{tRoot(props.free.priceKey)}</p>
            </div>
            <div className="bg-primary/5 min-w-32 border-l p-4 text-center">
              <p className="text-foreground font-medium">{tRoot(props.pro.nameKey)}</p>
              <p className="text-2xl font-medium">{tRoot(props.pro.priceKey)}</p>
            </div>
          </div>
          {props.rows.map((row, index) => (
            <div key={index} className="grid grid-cols-3 border-t">
              <div className="text-muted-foreground p-4 text-sm">
                {tRoot(row.nameKey)}
              </div>
              <div className="flex min-w-32 items-center justify-center border-l p-4 text-sm">
                <CellValue value={row.free} tRoot={tRoot} />
              </div>
              <div className="bg-primary/5 flex min-w-32 items-center justify-center border-l p-4 text-sm">
                <CellValue value={row.pro} tRoot={tRoot} highlighted />
              </div>
            </div>
          ))}
          <div className="grid grid-cols-3 border-t">
            <div className="p-4" />
            <div className="min-w-32 border-l p-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={props.free.ctaHref}>{tRoot(props.free.ctaLabelKey)}</Link>
              </Button>
            </div>
            <div className="bg-primary/5 min-w-32 border-l p-4">
              <Button asChild size="sm" className="w-full">
                <Link href={props.pro.ctaHref}>{tRoot(props.pro.ctaLabelKey)}</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

const CellValue = ({
  value,
  tRoot,
  highlighted = false,
}: {
  value: ComparatorRow["free"];
  tRoot: (key: ComparatorRow["nameKey"]) => string;
  highlighted?: boolean;
}) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check aria-hidden className="text-primary size-4" />
    ) : (
      <Minus aria-hidden className="text-muted-foreground/50 size-4" />
    );
  }
  return (
    <span className={cn("text-foreground", highlighted && "font-medium")}>
      {tRoot(value.labelKey)}
    </span>
  );
};
