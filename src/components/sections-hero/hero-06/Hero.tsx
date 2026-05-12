import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { ProductIllustration } from "@/components/ui-illustrations/product-illustration";
import { LogoCloud01Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-01";
import { useScopedT } from "@/i18n/scoped-t";
import {
  hero06AnnouncementHref,
  hero06BackgroundImage,
  hero06CtaHref,
  hero06Namespace,
} from "./config";

/**
 * Centered serif hero with bordered "corner-bevel" wrapper, soft photo
 * backdrop, framed `ProductIllustration` and `LogoCloud` trail.
 * Sourced from `@tailark-pro/hero-section-6`, refactored to the project
 * pattern: section semantics (no `<main>` — that's the layout's job),
 * all visible strings via `blocks.hero-06.*`, primitives from
 * `ui-primitives`, illustration from `ui-illustrations`, logo cloud
 * from `sections-logo-cloud`. The background image URL lives in
 * `config.ts` so projects override it without touching the component.
 */
export function Hero() {
  const [t] = useScopedT(hero06Namespace);

  return (
    <section
      aria-labelledby="hero-06-title"
      className="selection:bg-primary-foreground selection:text-primary bg-background relative overflow-hidden"
    >
      <div className="pt-15">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 mx-auto max-w-6xl border-x"
        />
        <div
          aria-hidden
          className="corner-bevel pointer-events-none absolute inset-0 inset-x-0 top-15 z-10 mx-auto max-w-332 rounded-t-[2rem] border-x border-t"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 inset-x-0 z-10 mx-auto h-15 max-w-316 border-x"
        />
        <div className="flex justify-center">
          <div className="relative flex flex-wrap items-center justify-center gap-3 p-4">
            <div className="bg-foreground text-background rounded-full px-2 py-1 text-xs">
              {t("announcement.badge")}
            </div>
            <Link
              href={hero06AnnouncementHref as Parameters<typeof Link>[0]["href"]}
              className="group flex items-center gap-2 text-sm after:absolute after:inset-0"
            >
              {t("announcement.label")}
              <ChevronRight className="size-4 not-group-hover:opacity-50" aria-hidden />
            </Link>
          </div>
        </div>
        <div className="corner-t-notch relative z-10 mx-auto grid max-w-6xl rounded-t-[2rem] border-x border-t px-6 py-16 max-md:pb-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              id="hero-06-title"
              className="text-foreground text-4xl leading-[1.1] font-medium tracking-[-0.5px] text-balance md:text-5xl"
            >
              {t("title")}
            </h1>

            <p className="text-muted-foreground mt-4 mb-6 text-lg text-balance">
              {t("body")}
            </p>

            <Button asChild size="lg" className="rounded-full px-6 shadow-transparent">
              <Link href={hero06CtaHref as Parameters<typeof Link>[0]["href"]}>
                {t("cta")}
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative -mt-px border-y">
          <div className="absolute inset-0 mask-t-from-25%">
            <Image
              src={hero06BackgroundImage}
              alt={t("imageAlt")}
              className="size-full object-cover object-top dark:opacity-25"
              width={1920}
              height={1080}
            />
          </div>
          <div className="relative mx-auto max-w-6xl overflow-hidden py-6 md:py-16">
            <div
              aria-hidden
              className="absolute inset-0 grid grid-cols-3 gap-px *:border-x *:first:border-l-0 *:last:border-r-0 md:grid-cols-6"
            >
              <div />
              <div className="max-md:hidden" />
              <div className="max-md:hidden" />
              <div className="max-md:hidden" />
              <div />
              <div />
            </div>
            <div
              aria-hidden
              className="*:from-foreground/6.5 *:to-foreground/6.5 absolute inset-0 grid grid-cols-3 gap-px mask-t-from-65% *:bg-linear-to-l *:via-transparent md:grid-cols-6"
            >
              <div />
              <div className="max-md:hidden" />
              <div className="max-md:hidden" />
              <div className="max-md:hidden" />
              <div />
              <div />
            </div>

            <div className="relative z-10">
              <ProductIllustration />
            </div>
          </div>
        </div>
      </div>
      <LogoCloud />
    </section>
  );
}
