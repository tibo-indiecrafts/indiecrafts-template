import { Cpu, Lock, Sparkles, Zap, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useScopedT } from "@/components/_lib/scoped-t";
import { content02Namespace } from "./config";
import type { ContentBlock, ContentInlineFeatureIcon } from "./schema";

const ICONS: Record<ContentInlineFeatureIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
};

export default function Content(props: Readonly<ContentBlock>) {
  const [, tr, tRoot] = useScopedT(content02Namespace);
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
        <div className="relative">
          <div className="relative z-10 space-y-4 md:w-1/2">
            <p>
              <span className="font-medium">{tr(props.leadingKey, "leading")}</span>
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
          <div className="mt-12 h-fit md:absolute md:inset-x-0 md:-inset-y-12 md:mt-0 md:mask-l-from-35% md:mask-l-to-55%">
            <div className="border-border/50 relative rounded-2xl border border-dotted p-2">
              {props.imageDarkUrl ? (
                <Image
                  src={props.imageDarkUrl}
                  className="hidden rounded-[12px] dark:block"
                  alt={alt}
                  width={1207}
                  height={929}
                />
              ) : null}
              <Image
                src={props.imageLightUrl}
                className={`rounded-[12px] shadow ${props.imageDarkUrl ? "dark:hidden" : ""}`}
                alt={alt}
                width={1207}
                height={929}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
