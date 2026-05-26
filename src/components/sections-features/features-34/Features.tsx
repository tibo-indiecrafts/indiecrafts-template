import Image from "next/image";
import { CalendarDays, Clock2, Zap } from "lucide-react";
import { Cloudflare } from "@/components/ui-primitives/svgs/libre-landing-cloudflare";
import { Linear } from "@/components/ui-primitives/svgs/libre-landing-linear";
import { Vercel } from "@/components/ui-primitives/svgs/libre-landing-vercel";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features34Namespace } from "./config";
import type { Features34Block } from "./schema";

const subFeatures = [
  { icon: Clock2, key: "tile1" },
  { icon: Zap, key: "tile2" },
  { icon: CalendarDays, key: "tile3" },
] as const;

export default function Features(props: Readonly<Features34Block>) {
  const [t] = useScopedT(features34Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="@container py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative grid @3xl:grid-cols-3 @3xl:gap-12">
          <div className="flex flex-col justify-between gap-12 @3xl:pb-3">
            <div>
              <h2
                id={`${props.id}-heading`}
                className="relative z-10 text-4xl font-semibold text-balance md:text-5xl"
              >
                {t("title")}
              </h2>
              <p className="text-muted-foreground my-6 max-w-2xl text-lg">{t("body")}</p>
            </div>

            <div className="max-w-56 space-y-3">
              <h3 className="font-medium">{t("ideLabel")}</h3>
              <div className="*:bg-foreground/5 grid grid-cols-3 gap-0.5 *:flex *:items-center *:justify-center *:rounded *:px-2 *:py-3">
                <div className="rounded-l-lg!">
                  <Linear className="size-5" />
                </div>
                <div>
                  <Vercel className="size-5" />
                </div>
                <div className="rounded-r-lg!">
                  <Cloudflare className="size-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto h-fit max-lg:-mx-6 max-lg:overflow-hidden max-lg:pt-12 max-lg:pb-16 max-lg:pl-6 @3xl:col-span-2">
            <div className="bg-background ring-foreground/10 min-w-3xl overflow-hidden rounded-2xl p-1 shadow-2xl ring-1 shadow-indigo-900/35 backdrop-blur">
              <div className="relative aspect-video origin-top rounded-xl">
                <Image
                  className="size-full object-cover object-top-left"
                  src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-4_lkhxqm.png"
                  alt={t("imageAlt")}
                  width={1520}
                  height={1013}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1520px"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-6 lg:mt-16 @4xl:grid-cols-3 @4xl:gap-12">
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
    </section>
  );
}
