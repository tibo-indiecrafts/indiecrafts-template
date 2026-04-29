import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import type { Content3Block } from "./schema";

export default function Content3(props: Readonly<Content3Block>) {
  const t = useTranslations();
  const external = props.ctaHref.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-12">
        <Image
          className="rounded-(--radius) grayscale"
          src={props.imageUrl}
          alt={t(props.imageAltKey)}
          width={1600}
          height={900}
          sizes="(max-width: 1024px) 100vw, 1024px"
        />

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 id={`${props.id}-title`} className="text-4xl font-medium text-balance">
            {t(props.titleKey)}
          </h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">{t(props.bodyKey)}</p>
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
