import Image from "next/image";
import { CalendarDays, Clock2, Zap } from "lucide-react";
import { useScopedT } from "@/i18n/scoped-t";
import { features36Namespace } from "./config";
import type { Features36Block } from "./schema";

const subFeatures = [
  { icon: Clock2, key: "tile1" },
  { icon: Zap, key: "tile2" },
  { icon: CalendarDays, key: "tile3" },
] as const;

/**
 * Features-36 — JSX verbatim. Product-direction heading + product
 * screenshot + 3 sub-feature tiles.
 */
export default function Features(props: Readonly<Features36Block>) {
  const [t] = useScopedT(features36Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="@container py-24">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="relative">
          <div className="max-w-xl">
            <span className="text-primary font-mono text-sm uppercase">
              {t("eyebrow")}
            </span>
            <h2
              id={`${props.id}-heading`}
              className="text-foreground mt-8 mb-4 text-4xl font-semibold md:text-5xl"
            >
              {t("title")}
            </h2>
            <p className="text-muted-foreground text-balance">
              {t("bodyHead")}{" "}
              <span className="text-muted-foreground"> {t("bodyTail")}</span>
            </p>
          </div>

          <div className="py-16 max-lg:-mx-6 max-lg:overflow-hidden max-lg:pl-6">
            <div className="bg-background ring-foreground/10 min-w-3xl overflow-hidden rounded-2xl p-1 shadow-2xl ring-1 shadow-indigo-900/35 backdrop-blur">
              <div className="border-background relative aspect-video origin-top rounded-xl border-l-4">
                <Image
                  className="size-full object-cover object-top-left"
                  src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle_un3f39.png"
                  alt={t("imageAlt")}
                  width={2880}
                  height={1920}
                  sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
                />
              </div>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-6 @4xl:grid-cols-3 @4xl:gap-12">
            {subFeatures.map((feature, index) => (
              <div key={index} className="space-y-1.5">
                <feature.icon className="fill-foreground/10 size-4" />
                <h3 className="mt-3 font-medium">
                  {t(`subFeatures.${feature.key}.title`)}
                </h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {t(`subFeatures.${feature.key}.body`)}
                </p>
              </div>
            ))}
            <div className="space-y-1.5 md:hidden">
              <CalendarDays className="fill-foreground/10 size-4" />
              <h3 className="mt-3 font-medium">{t("subFeatures.tile3.title")}</h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {t("subFeatures.tile3.body")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
