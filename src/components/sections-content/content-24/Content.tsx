import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/components/_lib/scoped-t";
import { content24Namespace } from "./config";
import type { ContentBlock } from "./schema";

export default function Content(props: Readonly<ContentBlock>) {
  const [, , tRoot] = useScopedT(content24Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 id={headingId} className="text-4xl font-medium">
            {tRoot(props.titleKey)}
          </h2>
          <div className="space-y-6">
            <p>{tRoot(props.body1Key)}</p>
            <p>
              {tRoot(props.body2BrandKey)}
              <span className="font-bold">{tRoot(props.body2StrongKey)}</span>
              {tRoot(props.body2RestKey)}
            </p>
            <Button asChild variant="secondary" size="sm" className="gap-1 pr-1.5">
              <Link href={props.cta.href}>
                <span>{tRoot(props.cta.labelKey)}</span>
                <ChevronRight className="size-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
