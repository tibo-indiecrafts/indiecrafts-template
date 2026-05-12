"use client";

import { ArrowUp, Globe, Play, Plus, Sparkle } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { useScopedT } from "@/i18n/scoped-t";
import {
  hero01BackgroundImage,
  hero01Namespace,
  hero01PrimaryCtaHref,
  hero01SecondaryCtaHref,
} from "./config";

export function Hero() {
  const [t] = useScopedT(hero01Namespace);
  const { scrollY } = useScroll();
  const parallaxFactor = 0.25;
  const y = useTransform(scrollY, [0, 500], [0, 500 * parallaxFactor], {
    clamp: false,
  });

  return (
    <section aria-labelledby="hero-01-title" className="bg-background overflow-hidden">
      <div className="relative pt-24 pb-36 lg:pt-16">
        <div className="relative z-10 mx-auto max-w-5xl px-(--gutter)">
          <div className="text-center">
            <h1
              id="hero-01-title"
              className="mx-auto mt-8 max-w-xl text-4xl font-semibold text-balance md:text-5xl"
            >
              {t("title")}
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 mb-8 max-w-xl text-lg text-balance">
              {t("body")}
            </p>

            <div className="flex items-center justify-center gap-3 max-sm:flex-col">
              <Button asChild>
                <Link href={hero01PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                  <span className="text-nowrap">{t("primaryCta")}</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="pl-3.5">
                <Link href={hero01SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                  <Play className="fill-foreground !size-3" aria-hidden="true" />
                  <span className="text-nowrap">{t("secondaryCta")}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden pb-12 max-md:px-(--gutter)">
          <div className="absolute inset-0 mx-auto mask-radial-to-65% lg:w-2/3 dark:hidden">
            <motion.img
              style={{ y }}
              className="mx-auto size-full origin-top object-cover mix-blend-multiply"
              src={hero01BackgroundImage.light}
              alt={t("imageAlt")}
            />
          </div>

          <div className="absolute inset-0 mx-auto mask-radial-to-65% not-dark:hidden lg:w-2/3">
            <motion.img
              style={{ y }}
              className="mx-auto size-full origin-top object-cover mix-blend-multiply"
              src={hero01BackgroundImage.dark}
              alt={t("imageAlt")}
            />
          </div>

          <div className="pb-12">
            <div
              aria-hidden
              className="bg-card/75 ring-border m-auto max-w-sm translate-y-12 rounded-2xl border border-transparent p-6 shadow-xl ring-1 shadow-black/6.5 backdrop-blur-3xl"
            >
              <div className="flex gap-1">
                <div className="bg-foreground/10 size-2 rounded-full" />
                <div className="bg-foreground/10 size-2 rounded-full" />
                <div className="bg-foreground/10 size-2 rounded-full" />
              </div>

              <div className="mt-6 text-center">
                <div className="flex justify-center gap-1">
                  <div className="border-background relative flex size-5 items-center justify-center rounded-full border bg-linear-to-b from-purple-300 to-indigo-600 shadow-md ring-1 shadow-black/20 ring-black/10 dark:border-0 dark:inset-shadow-2xs dark:inset-ring dark:shadow-white/10 dark:ring-black/50 dark:inset-shadow-white/25 dark:inset-ring-white/25">
                    <div className="absolute inset-1 aspect-square rounded-full border border-white/35 bg-black/15" />
                    <div className="absolute inset-px aspect-square rounded-full border border-dashed border-white/25" />
                    <Sparkle className="size-3 fill-white stroke-white drop-shadow-sm" />
                  </div>
                  <span className="text-[15px] font-medium">{t("ai.badge")}</span>
                </div>
                <p className="text-foreground/75 mx-auto mt-3 max-w-40 leading-tight text-balance">
                  {t("ai.tagline")}
                </p>
                <div className="border-background bg-foreground/10 inline-flex h-0.5 w-20 border-b" />
              </div>

              <div className="mt-4 mb-8 space-y-6">
                <div className="ml-auto w-fit max-w-3/4">
                  <p className="border-foreground/5 bg-foreground/5 mb-2 rounded-t-2xl rounded-l-2xl rounded-br border p-4 text-sm">
                    {t("ai.outgoingMessage")}
                  </p>
                  <span className="text-muted-foreground block text-right text-xs">
                    {t("ai.now")}
                  </span>
                </div>
                <div className="w-fit max-w-3/4">
                  <Sparkle
                    className="size-4 fill-white stroke-white drop-shadow-md"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-sm">{t("ai.incomingMessage")}</p>
                </div>
              </div>

              <div className="bg-foreground/5 -mx-3 -mb-3 space-y-3 rounded-lg p-3">
                <div className="text-muted-foreground text-sm">{t("ai.askAnything")}</div>

                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7 rounded-2xl bg-transparent shadow-none"
                      aria-label="Add"
                    >
                      <Plus aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7 rounded-2xl bg-transparent shadow-none"
                      aria-label="Search"
                    >
                      <Globe aria-hidden="true" />
                    </Button>
                  </div>

                  <Button
                    size="icon"
                    className="bg-foreground text-background size-7 rounded-2xl"
                    aria-label="Send"
                  >
                    <ArrowUp strokeWidth={2} aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl px-(--gutter) text-center">
          <p className="text-muted-foreground text-sm">{t("trustedBy")}</p>
          <div className="**:fill-foreground mx-auto mt-6 flex w-full max-w-lg flex-wrap items-center justify-center gap-8 *:w-fit lg:justify-between">
            <Hulu height={20} width="auto" />
            <Spotify height={26} width="auto" />
            <Supabase height={24} width="auto" />
            <Beacon height={20} width="auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
