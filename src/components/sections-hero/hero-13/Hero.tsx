"use client";
import { ParallaxImage } from "@/components/ui-effects/parallax-image";
import { AudioLinesIcon } from "@/components/ui-illustrations/audio-lines";
import { AnimatedGroup } from "@/components/ui-effects/animated-group";
import { LogoCloud04Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-04";
import { motion } from "motion/react";
import Image from "next/image";
import { useScopedT } from "@/i18n/scoped-t";
import { hero13BackgroundImage, hero13Namespace } from "./config";

/**
 * Centered headline with inline animated audio-lines icon + body +
 * parallax-on-scroll image card with a Watch-demo pill, with a
 * compact `LogoCloud` strip below. Sourced from
 * `@tailark-pro/hero-section-13`, refactored to the project pattern:
 * section semantics (no `<main>` — that's the layout's job), all
 * visible strings via `blocks.hero-13.*`, parallax effect from
 * `ui-effects/parallax-image`, animated icon from
 * `ui-illustrations/audio-lines`, animation primitive from
 * `ui-effects/animated-group`, logo cloud from `sections-logo-cloud`.
 * The light-mode backdrop image URL lives in `config.ts`.
 */
export function Hero() {
  const [t] = useScopedT(hero13Namespace);

  return (
    <section
      aria-labelledby="hero-13-title"
      className="bg-background relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: -72, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 mask-radial-[100%_85%] mask-radial-from-80% mask-radial-at-top-right opacity-75 dark:hidden"
      >
        <Image
          src={hero13BackgroundImage}
          alt={t("imageAlt")}
          className="size-full -scale-y-100 object-cover"
          height={2070}
          width={2070}
        />
      </motion.div>

      <div className="pt-24 pb-20 perspective-dramatic md:pt-32 lg:py-44">
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                  },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  filter: "blur(12px)",
                  y: -16,
                },
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    bounce: 0.3,
                    duration: 1,
                  },
                },
              },
            }}
          >
            <h1
              id="hero-13-title"
              className="mx-auto mt-8 inline-flex max-w-xl flex-wrap items-center justify-center gap-x-2 text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl"
            >
              {t("title.first")}{" "}
              <span className="text-muted-foreground">{t("title.second")}</span>
              <AudioIconBadge />
              <span className="text-muted-foreground">{t("title.third")}</span>{" "}
              {t("title.fourth")}
            </h1>

            <div className="mx-auto mt-4 max-w-md">
              <p className="text-muted-foreground mb-5 text-lg text-balance">
                {t("body")}
              </p>
            </div>
          </AnimatedGroup>

          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 1,
                    delayChildren: 0.4,
                  },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  filter: "blur(12px)",
                  y: -120,
                  rotateX: 56,
                  scale: 2,
                },
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    bounce: 0.2,
                    duration: 2,
                  },
                },
              },
            }}
          >
            <ParallaxImage />
          </AnimatedGroup>

          <LogoCloud />
        </div>
      </div>
    </section>
  );
}

const AudioIconBadge = () => (
  <div
    aria-hidden
    className="before:inset-ring-background/25 relative flex size-10 translate-y-0.5 items-center justify-center rounded-lg bg-linear-to-b from-amber-300 to-rose-500 shadow-lg shadow-black/20 before:absolute before:inset-0 before:rounded-lg before:border before:border-black/15 before:inset-ring-1"
  >
    <AudioLinesIcon className="size-6 -translate-x-0.5 mask-b-from-25% stroke-white text-white *:drop-shadow" />
    <AudioLinesIcon className="absolute inset-0 m-auto size-6 -translate-x-0.5 stroke-white text-white opacity-65 *:drop-shadow" />
  </div>
);
