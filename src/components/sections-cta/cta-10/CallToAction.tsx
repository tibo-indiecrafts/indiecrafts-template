import Link from "next/link";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cta10Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, , tRoot] = useScopedT(cta10Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2
                id={headingId}
                className="text-foreground text-3xl font-semibold text-balance lg:text-4xl"
              >
                {tRoot(props.titleKey)}
              </h2>
            </div>
            <div className="flex justify-end gap-3">
              <Button asChild variant="outline" size="lg">
                <Link href={props.secondary.href}>{tRoot(props.secondary.labelKey)}</Link>
              </Button>
              <Button asChild size="lg">
                <Link href={props.primary.href}>{tRoot(props.primary.labelKey)}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
