import { Cpu, Lock, Sparkles, Zap, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useScopedT } from "@/i18n/scoped-t";
import { content07Namespace } from "./config";
import type { ContentBlock, ContentInlineFeatureIcon } from "./schema";

const ICONS: Record<ContentInlineFeatureIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
};

export default function Content(props: Readonly<ContentBlock>) {
  const [, tr, tRoot] = useScopedT(content07Namespace);
  const alt = tr(props.imageAltKey, "imageAlt");

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-16">
        <h2
          id={`${props.id}-title`}
          className="relative z-10 max-w-xl text-4xl font-medium text-balance lg:text-5xl"
        >
          {tr(props.titleKey, "title")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              <span className="text-accent-foreground font-bold">
                {tr(props.leadingKey, "leading")}
              </span>
            </p>
            <p className="text-muted-foreground">
              {tr(props.supportingKey, "supporting")}
            </p>

            <ul className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
              {props.features.map((feature, i) => {
                const Icon = ICONS[feature.iconKey];
                return (
                  <li key={i} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4" aria-hidden="true" />
                      <h3 className="text-sm font-medium">{tRoot(feature.titleKey)}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {tRoot(feature.bodyKey)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative mt-6 sm:mt-0">
            <div className="from-muted relative aspect-67/34 rounded-2xl bg-linear-to-b to-transparent p-px">
              {props.imageDarkUrl ? (
                <Image
                  src={props.imageDarkUrl}
                  className="absolute inset-0 hidden h-full w-full rounded-[15px] object-cover dark:block"
                  alt={alt}
                  width={1206}
                  height={612}
                />
              ) : null}
              <Image
                src={props.imageLightUrl}
                className={`absolute inset-0 h-full w-full rounded-[15px] object-cover shadow ${props.imageDarkUrl ? "dark:hidden" : ""}`}
                alt={alt}
                width={1206}
                height={612}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
