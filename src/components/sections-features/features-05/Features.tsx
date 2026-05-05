import Image from "next/image";
import {
  Activity,
  DraftingCompass,
  Mail,
  Shield,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useScopedT } from "@/i18n/scoped-t";
import { features05Namespace } from "./config";
import type { FeaturesBlock, FeaturesBulletIcon } from "./schema";

const ICONS: Record<FeaturesBulletIcon, LucideIcon> = {
  mail: Mail,
  zap: Zap,
  activity: Activity,
  compass: DraftingCompass,
  shield: Shield,
  sparkles: Sparkles,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features05Namespace);
  const alt = tr(props.imageAltKey, "imageAlt");

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-(--gutter)">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
          <div className="lg:col-span-2">
            <div className="md:pr-6 lg:pr-0">
              <h2
                id={`${props.id}-title`}
                className="text-4xl font-semibold text-balance lg:text-5xl"
              >
                {tr(props.titleKey, "title")}
              </h2>
              <p className="text-muted-foreground mt-6">{tr(props.bodyKey, "body")}</p>
            </div>
            <ul className="mt-8 divide-y border-y">
              {props.bullets.map((bullet, i) => {
                const Icon = ICONS[bullet.iconKey];
                return (
                  <li key={i} className="flex items-center gap-3 py-3">
                    <Icon className="size-5" aria-hidden="true" />
                    <span>{tRoot(bullet.labelKey)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
            <div className="from-muted relative aspect-76/59 rounded-2xl bg-linear-to-b to-transparent p-px">
              {props.imageDarkUrl ? (
                <Image
                  src={props.imageDarkUrl}
                  className="absolute inset-0 hidden h-full w-full rounded-[15px] object-cover dark:block"
                  alt={alt}
                  width={1207}
                  height={929}
                />
              ) : null}
              <Image
                src={props.imageLightUrl}
                className={`absolute inset-0 h-full w-full rounded-[15px] object-cover shadow ${props.imageDarkUrl ? "dark:hidden" : ""}`}
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
