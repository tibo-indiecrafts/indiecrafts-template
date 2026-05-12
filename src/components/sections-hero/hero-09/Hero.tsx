import { ProductCards } from "@/components/ui-illustrations/product-cards";
import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { LogoCloud02Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-02";
import { useScopedT } from "@/i18n/scoped-t";
import {
  hero09AnnouncementHref,
  hero09Namespace,
  hero09PrimaryCtaHref,
  hero09SecondaryCtaHref,
} from "./config";

export function Hero() {
  const [t] = useScopedT(hero09Namespace);

  return (
    <section
      aria-labelledby="hero-09-title"
      className="bg-background relative overflow-hidden"
    >
      <div className="pt-20 md:pt-28">
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="relative p-2">
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-between max-md:hidden"
            >
              <div className="space-y-2 px-12 py-2">
                <div className="h-2 w-32 [background:repeating-linear-gradient(90deg,var(--color-border-illustration),var(--color-border-illustration)_1.5px,transparent_1.5px,transparent_4px)]" />
                <div className="h-2 w-20 [background:repeating-linear-gradient(90deg,var(--color-border-illustration),var(--color-border-illustration)_1.5px,transparent_1.5px,transparent_4px)]" />
              </div>
              <div className="space-y-2 px-12 py-2">
                <div className="h-2 w-32 [background:repeating-linear-gradient(90deg,var(--color-border-illustration),var(--color-border-illustration)_1.5px,transparent_1.5px,transparent_4px)]" />
                <div className="ml-auto h-2 w-20 [background:repeating-linear-gradient(90deg,var(--color-border-illustration),var(--color-border-illustration)_1.5px,transparent_1.5px,transparent_4px)]" />
              </div>
            </div>

            <div className="mx-auto flex w-fit items-center gap-4">
              <div aria-hidden className="flex items-center gap-3 max-sm:hidden">
                <div className="bg-border-illustration h-px w-6" />
                <div className="border-border-illustration size-2 rounded-full border" />
                <div className="ml-auto h-4 w-6 [background:repeating-linear-gradient(45deg,var(--color-border-illustration),var(--color-border-illustration)_1px,transparent_1px,transparent_6px)]" />
              </div>
              <div className="after:border-border-illustration before:border-border-illustration bg-foreground/3 relative p-2 before:pointer-events-none before:absolute before:-inset-x-6 before:inset-y-0 before:border-y after:pointer-events-none after:absolute after:inset-x-0 after:-inset-y-3 after:border-x">
                <div className="bg-card/75 ring-border-illustration relative mx-auto flex h-fit w-fit items-center gap-2 rounded-full px-3 py-1 shadow ring-1">
                  <span className="text-foreground text-sm">
                    {t("announcement.label")}
                  </span>
                  <span className="bg-foreground/10 block h-3 w-px" />
                  <Link
                    href={hero09AnnouncementHref as Parameters<typeof Link>[0]["href"]}
                    className="text-primary text-sm"
                  >
                    {t("announcement.linkLabel")}
                  </Link>
                </div>
              </div>
              <div aria-hidden className="flex items-center gap-3 max-sm:hidden">
                <div className="border-border-illustration size-2 rotate-45 border" />
                <div className="ml-auto h-4 w-6 [background:repeating-linear-gradient(0deg,var(--color-border-illustration),var(--color-border-illustration)_1px,transparent_1px,transparent_6px)]" />
                <div className="bg-border-illustration h-px w-6" />
              </div>
            </div>
          </div>
          <div className="mt-6 px-6 text-center *:mx-auto md:mt-10 lg:px-12">
            <h1
              id="hero-09-title"
              className="mb-4 max-w-4xl text-5xl font-medium text-balance lg:text-7xl lg:tracking-tight"
            >
              <span className="max-sm:hidden">{t("title.prefix")}</span>
              {t("title.rest")}
            </h1>
            <div className="max-w-2xl">
              <p className="text-muted-foreground mb-6 text-lg text-balance">
                {t("body")}
              </p>
              <div className="flex items-center justify-between">
                <PixelStrip className="justify-end" />
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild>
                    <Link
                      href={hero09PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}
                    >
                      {t("primaryCta")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link
                      href={hero09SecondaryCtaHref as Parameters<typeof Link>[0]["href"]}
                    >
                      {t("secondaryCta")}
                    </Link>
                  </Button>
                </div>
                <PixelStrip />
              </div>
            </div>
          </div>
        </div>

        <ProductCards />

        <LogoCloud />
      </div>
    </section>
  );
}

const PixelStrip = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={`flex w-28 flex-wrap gap-2.5 opacity-75 ${className ?? ""}`.trim()}
    style={{ transform: "scale(0.85)" }}
  >
    {Array.from({ length: 10 }).map((_, index) => (
      <div key={index} className="h-5 w-2.5 max-sm:last:hidden">
        <div className="bg-card ring-foreground/5 h-1.5 rounded-t-xs shadow ring-1" />
        <div className="bg-foreground/5 border-foreground/10 relative mx-auto h-2 w-2 border-x" />
        <div className="bg-card ring-foreground/5 h-1.5 rounded-b-xs shadow ring-1" />
      </div>
    ))}
  </div>
);
