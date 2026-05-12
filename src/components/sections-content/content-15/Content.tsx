import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { content15Namespace } from "./config";
import type { ContentBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <strong className="text-foreground font-semibold">{chunks}</strong>
  ),
};

export default function Content(props: Readonly<ContentBlock>) {
  const [, , tRoot] = useScopedT(content15Namespace);
  const external = props.ctaHref.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 lg:gap-24">
          <h2
            id={`${props.id}-heading`}
            className="text-muted-foreground text-4xl font-semibold"
          >
            {tRoot.rich(props.titleKey, RICH_STRONG)}
          </h2>
          <div className="space-y-6">
            {props.bodyKeys.map((key, index) => (
              <p
                key={index}
                className="text-muted-foreground text-lg leading-relaxed text-balance"
              >
                {tRoot.rich(key, RICH_STRONG)}
              </p>
            ))}
            <Button asChild variant="outline" size="sm" className="gap-1 pr-1.5">
              <a
                href={props.ctaHref}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <span>{tRoot(props.ctaLabelKey)}</span>
                <ChevronRight className="size-2" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
