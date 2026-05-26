import Image from "next/image";
import { Cpu, Lock, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features06Namespace } from "./config";
import type { FeaturesBlock, ContentInlineFeatureIcon } from "./schema";

const ICONS: Record<ContentInlineFeatureIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features06Namespace);
  const alt = tr(props.imageAltKey, "imageAlt");

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-12 px-(--gutter)">
        <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
          <h2 id={`${props.id}-title`} className="text-4xl font-semibold text-balance">
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground max-w-sm sm:ml-auto">
            {tr(props.bodyKey, "body")}
          </p>
        </div>
        <div className="px-3 pt-3 md:-mx-8">
          <div className="relative aspect-88/36 mask-b-from-75% mask-b-to-95%">
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
