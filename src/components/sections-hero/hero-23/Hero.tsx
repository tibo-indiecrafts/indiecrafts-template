import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { InfiniteSlider } from "@/components/ui-effects/infinite-slider";
import { ProgressiveBlur } from "@/components/ui-effects/progressive-blur";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Bolt } from "@/components/ui-primitives/svgs/bolt";
import { Firebase } from "@/components/ui-primitives/svgs/firebase";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Figma } from "@/components/ui-primitives/svgs/figma";
import { Cisco } from "@/components/ui-primitives/svgs/cisco";
import { useScopedT } from "@/components/_lib/scoped-t";
import { hero23Namespace } from "./config";
import type { HeroBlock } from "./schema";

export default function Hero(props: Readonly<HeroBlock>) {
  const [, , tRoot] = useScopedT(hero23Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <div className="overflow-x-hidden">
        <div>
          <div className="relative">
            <div className="relative z-10 flex aspect-2/3 flex-col justify-end px-6 lg:aspect-video">
              <div className="mx-auto w-full max-w-7xl pb-6 lg:px-12 lg:pb-32">
                <div className="max-w-lg">
                  <h1
                    id={`${props.id}-heading`}
                    className="text-5xl text-balance md:text-6xl xl:text-7xl"
                  >
                    {tRoot(props.titleKey)}
                  </h1>
                  <p className="mt-6 text-lg text-balance">{tRoot(props.bodyKey)}</p>

                  <div className="mt-8 flex items-center gap-2">
                    <Button
                      asChild
                      size="lg"
                      className="h-12 rounded-full pr-3 pl-5 text-base"
                    >
                      <Link href={props.primary.href}>
                        <span className="text-nowrap">
                          {tRoot(props.primary.labelKey)}
                        </span>
                        <ChevronRight className="ml-1" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="ghost"
                      className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5"
                    >
                      <Link href={props.secondary.href}>
                        <span className="text-nowrap">
                          {tRoot(props.secondary.labelKey)}
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-1 aspect-2/3 overflow-hidden rounded-3xl border border-black/10 lg:aspect-video lg:rounded-[3rem] dark:border-white/5">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="size-full -scale-x-100 object-cover not-dark:invert"
                src={props.videoSrc}
              />
            </div>
          </div>
        </div>
        <div className="bg-background py-6">
          <div className="group relative m-auto max-w-7xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-44 md:border-r md:pr-6">
                <p className="text-end text-sm">{tRoot(props.logoStripLabelKey)}</p>
              </div>
              <div className="**:fill-foreground relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  <Bolt height={22} width={56} />
                  <VercelFull height={22} width={84} />
                  <Supabase className="h-6" />
                  <Hulu height={18} width={56} />
                  <Spotify height={24} width={80} />
                  <Firebase height={24} width={80} />
                  <Beacon height={24} width={80} />
                  <Claude height={26} width={90} />
                  <Figma height={24} width={24} />
                  <Cisco height={30} width={60} />
                </InfiniteSlider>

                <div
                  aria-hidden
                  className="from-background absolute inset-y-0 left-0 w-20 bg-linear-to-r"
                />
                <div
                  aria-hidden
                  className="from-background absolute inset-y-0 right-0 w-20 bg-linear-to-l"
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute top-0 left-0 h-full w-20"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute top-0 right-0 h-full w-20"
                  direction="right"
                  blurIntensity={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
