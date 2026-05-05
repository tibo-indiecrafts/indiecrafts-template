import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { content04Namespace } from "./config";
import type { ContentBlock } from "./schema";

export default function Content(props: Readonly<ContentBlock>) {
  const [, tr] = useScopedT(content04Namespace);
  const external = props.ctaHref.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 id={`${props.id}-title`} className="text-4xl font-medium text-balance">
            {tr(props.titleKey, "title")}
          </h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">{tr(props.leadingKey, "leading")}</p>
            <p className="text-muted-foreground">
              {tr(props.supportingKey, "supporting")}
            </p>
            <Button asChild variant="secondary" size="sm" className="gap-1 pr-1.5">
              <a
                href={props.ctaHref}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <span>{tr(props.ctaLabelKey, "cta")}</span>
                <ChevronRight className="size-3" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
