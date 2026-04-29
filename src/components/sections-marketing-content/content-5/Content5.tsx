import { useTranslations } from "next-intl";
import Image from "next/image";
import { Cpu, Lock, Sparkles, Zap, type LucideIcon } from "lucide-react";
import type { Content5Block, ContentInlineFeatureIcon } from "./schema";

const ICONS: Record<ContentInlineFeatureIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
};

export default function Content5(props: Readonly<Content5Block>) {
  const t = useTranslations();

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-12">
        <div className="mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-medium text-balance lg:text-5xl"
          >
            {t(props.titleKey)}
          </h2>
          <p className="text-muted-foreground">{t(props.bodyKey)}</p>
        </div>
        <Image
          className="rounded-(--radius) grayscale"
          src={props.imageUrl}
          alt={t(props.imageAltKey)}
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
                  <h3 className="text-sm font-medium">{t(feature.titleKey)}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t(feature.bodyKey)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
