import Image from "next/image";
import { Cpu, Lock, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { useScopedT } from "@/i18n/scoped-t";
import { content05Namespace } from "./config";
import type { ContentBlock, ContentInlineFeatureIcon } from "./schema";

const ICONS: Record<ContentInlineFeatureIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
};

export default function Content(props: Readonly<ContentBlock>) {
  const [, tr, tRoot] = useScopedT(content05Namespace);

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-12">
        <div className="mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-medium text-balance lg:text-5xl"
          >
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground">{tr(props.bodyKey, "body")}</p>
        </div>
        <Image
          className="rounded-(--radius) grayscale"
          src={props.imageUrl}
          alt={tr(props.imageAltKey, "imageAlt")}
          width={2400}
          height={1350}
          sizes="(max-width: 1024px) 100vw, 1024px"
        />

        <ul className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
          {props.features.map((feature, i) => {
            const Icon = ICONS[feature.iconKey];
            return (
              <li key={i} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="size-4" aria-hidden="true" />
                  <h3 className="text-sm font-medium">{tRoot(feature.titleKey)}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{tRoot(feature.bodyKey)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
