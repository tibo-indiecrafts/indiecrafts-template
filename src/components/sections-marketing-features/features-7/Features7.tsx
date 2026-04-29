import { useTranslations } from "next-intl";
import Image from "next/image";
import { Cpu, Lock, Sparkles, Zap, type LucideIcon } from "lucide-react";
import type { ContentInlineFeatureIcon, Features7Block } from "./schema";

const ICONS: Record<ContentInlineFeatureIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
};

export default function Features7(props: Readonly<Features7Block>) {
  const t = useTranslations();
  const alt = t(props.imageAltKey);

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="overflow-hidden py-16 md:py-32"
    >
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-12">
        <div className="relative z-10 max-w-2xl">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-semibold text-balance lg:text-5xl"
          >
            {t(props.titleKey)}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">{t(props.bodyKey)}</p>
        </div>
        <div className="relative -mx-4 mask-b-from-75% mask-b-to-95% mask-l-from-75% mask-l-to-95% pt-3 pr-3 md:-mx-12">
          <div className="perspective-midrange">
            <div className="rotate-x-6 -skew-2">
              <div className="relative aspect-88/36">
                <Image
                  src={props.upperImageUrl}
                  className="absolute inset-0 z-10 h-full w-full object-cover"
                  alt=""
                  width={2797}
                  height={1137}
                  aria-hidden="true"
                />
                {props.backImageDarkUrl ? (
                  <Image
                    src={props.backImageDarkUrl}
                    className="hidden h-full w-full object-cover dark:block"
                    alt={alt}
                    width={2797}
                    height={1137}
                  />
                ) : null}
                <Image
                  src={props.backImageLightUrl}
                  className={`h-full w-full object-cover ${props.backImageDarkUrl ? "dark:hidden" : ""}`}
                  alt={alt}
                  width={2797}
                  height={1137}
                />
              </div>
            </div>
          </div>
        </div>
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
