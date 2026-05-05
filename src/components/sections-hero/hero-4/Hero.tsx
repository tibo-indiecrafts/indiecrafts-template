import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { LogoCloud1Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-1";
import { ProductIllustration } from "@/components/ui-illustrations/product-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import {
  hero4AnnouncementHref,
  hero4Namespace,
  hero4PrimaryCtaHref,
  hero4SecondaryCtaHref,
} from "./config";

/**
 * Announcement chip + centered headline + dual CTA, framed by a
 * bordered window with corner-square decorators carrying the dashboard
 * mock illustration, with a brand `LogoCloud` underneath. Sourced from
 * `@tailark-pro/hero-section-4`, refactored to the project pattern:
 * section semantics (no `<main>` — that's the layout's job), all
 * visible strings via `blocks.hero-4.*`, primitives from
 * `ui-primitives`, illustration from `ui-illustrations`, logo cloud
 * from `sections-logo-cloud`.
 */
export function Hero() {
  const [t] = useScopedT(hero4Namespace);

  return (
    <section aria-labelledby="hero-4-title" className="overflow-x-hidden pb-6">
      <div className="relative mx-auto max-w-6xl border-x border-b px-3 pt-24 pb-10 md:pt-36 md:pb-20">
        <div>
          <div className="bg-foreground/5 relative mx-auto w-fit p-2">
            <Dot className="top-1 left-1" />
            <Dot className="top-1 right-1" />
            <Dot className="bottom-1 left-1" />
            <Dot className="right-1 bottom-1" />
            <div className="bg-card relative flex h-fit items-center gap-2 rounded-full px-3 py-1 shadow shadow-black/6.5 dark:border">
              <span className="text-foreground text-sm">{t("announcement.label")}</span>
              <span className="bg-foreground/5 block h-3 w-px" />
              <Link
                href={hero4AnnouncementHref as Parameters<typeof Link>[0]["href"]}
                className="text-primary text-sm"
              >
                {t("announcement.linkLabel")}
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-3xl text-center md:mt-10">
          <h1
            id="hero-4-title"
            className="text-foreground text-4xl font-medium text-balance sm:text-5xl lg:text-6xl"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 mb-8 max-w-xl text-lg text-balance">
            {t("body")}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild>
              <Link href={hero4PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                {t("primaryCta")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={hero4SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}>
                {t("secondaryCta")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="relative mx-auto max-w-6xl border-x px-4 sm:px-6 md:px-12">
          <SquareDecorator className="-top-[3.5px] -left-[3.5px]" />
          <SquareDecorator className="-top-[3.5px] left-3 translate-x-[1.5px] sm:left-5 md:left-11" />
          <SquareDecorator className="-top-[3.5px] -right-[3.5px]" />
          <SquareDecorator className="-top-[3.5px] right-3 -translate-x-[1.5px] sm:right-5 md:right-11" />
          <SquareDecorator className="-bottom-[3.5px] -left-[3.5px]" />
          <SquareDecorator className="-bottom-[3.5px] left-3 translate-x-[1.5px] sm:left-5 md:left-11" />
          <SquareDecorator className="-right-[3.5px] -bottom-[3.5px]" />
          <SquareDecorator className="right-3 -bottom-[3.5px] -translate-x-[1.5px] sm:right-5 md:right-11" />
          <div className="bg-background dark:bg-background relative overflow-hidden border-x">
            <ProductIllustration className="bg-background w-full max-w-none border-t-0" />
          </div>
        </div>
      </div>

      <LogoCloud />
    </section>
  );
}

const Dot = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn("bg-foreground/20 absolute size-[3px] rounded-full", className)}
  />
);

const SquareDecorator = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      "bg-card ring-foreground/10 pointer-events-none absolute z-10 size-1.5 border border-transparent shadow-sm ring-1",
      className,
    )}
  />
);
