import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import type { Content4Block } from "./schema";

export default function Content4(props: Readonly<Content4Block>) {
  const t = useTranslations();
  const external = props.ctaHref.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 id={`${props.id}-title`} className="text-4xl font-medium text-balance">
            {t(props.titleKey)}
          </h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">{t(props.leadingKey)}</p>
            <p className="text-muted-foreground">{t(props.supportingKey)}</p>
            <Button asChild variant="secondary" size="sm" className="gap-1 pr-1.5">
              <a
                href={props.ctaHref}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <span>{t(props.ctaLabelKey)}</span>
                <ChevronRight className="size-3" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
