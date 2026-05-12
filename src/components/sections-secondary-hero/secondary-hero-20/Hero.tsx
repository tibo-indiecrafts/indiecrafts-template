import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import Image from "next/image";
import { useScopedT } from "@/i18n/scoped-t";
import {
  secondaryHero20BackgroundImage,
  secondaryHero20Namespace,
  secondaryHero20PrimaryCtaHref,
  secondaryHero20SecondaryCtaHref,
} from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero20Namespace);

  return (
    <section aria-labelledby="secondary-hero-20-title" className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="max-md:text-center">
            <span className="text-primary text-sm font-medium">{t("tag")}</span>
            <h1
              id="secondary-hero-20-title"
              className="mt-4 text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
            >
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-4 mb-6 max-w-md text-lg text-balance max-md:mx-auto">
              {t("body")}
            </p>

            <Button asChild>
              <Link
                href={secondaryHero20PrimaryCtaHref as Parameters<typeof Link>[0]["href"]}
              >
                {t("primaryCta")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="ml-3">
              <Link
                href={
                  secondaryHero20SecondaryCtaHref as Parameters<typeof Link>[0]["href"]
                }
              >
                {t("secondaryCta")}
              </Link>
            </Button>

            <div className="mt-12 grid max-w-sm grid-cols-2 max-md:mx-auto">
              <div className="space-y-2 *:block">
                <span className="text-lg font-semibold">
                  {t("stats.uptime.value")}{" "}
                  <span className="text-muted-foreground text-lg">
                    {t("stats.uptime.unit")}
                  </span>
                </span>
                <p className="text-muted-foreground text-sm text-balance">
                  <strong className="text-foreground font-medium">
                    {t("stats.uptime.label")}
                  </strong>{" "}
                  {t("stats.uptime.description")}
                </p>
              </div>
              <div className="space-y-2 *:block">
                <span className="text-lg font-semibold">
                  {t("stats.speed.value")}{" "}
                  <span className="text-muted-foreground text-lg">
                    {t("stats.speed.unit")}
                  </span>
                </span>
                <p className="text-muted-foreground text-sm text-balance">
                  <strong className="text-foreground font-medium">
                    {t("stats.speed.label")}
                  </strong>{" "}
                  {t("stats.speed.description")}
                </p>
              </div>
            </div>
          </div>

          <InvoiceOverlay
            imageAlt={t("imageAlt")}
            invoiceId={t("invoice.id")}
            invoiceAmount={t("invoice.amount")}
            invoiceDue={t("invoice.due")}
            signHere={t("invoice.signHere")}
          />
        </div>
      </div>
    </section>
  );
}

const InvoiceOverlay = ({
  imageAlt,
  invoiceId,
  invoiceAmount,
  invoiceDue,
  signHere,
}: {
  imageAlt: string;
  invoiceId: string;
  invoiceAmount: string;
  invoiceDue: string;
  signHere: string;
}) => (
  <div className="relative max-md:-mx-6">
    <div className="absolute inset-y-0 z-1 my-auto h-fit w-full max-w-72 origin-left scale-75 max-lg:left-6">
      <div className="absolute -inset-6 bg-linear-to-r from-purple-400 via-emerald-400 to-white opacity-25 blur-3xl dark:opacity-15" />
      <div className="bg-card ring-border relative rounded-2xl p-6 shadow-xl ring-1 shadow-black/6.5">
        <div className="mb-6 flex items-start justify-between">
          <div className="space-y-0.5">
            <LogoIcon />
            <div className="mt-4 font-mono text-xs">{invoiceId}</div>
            <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">
              {invoiceAmount}
            </div>
            <div className="text-xs font-medium">{invoiceDue}</div>
          </div>
        </div>
        <div className="border-foreground/15 bg-foreground/5 mt-6 flex h-24 items-center justify-center rounded-md border border-dashed">
          <div className="text-foreground/50 border-foreground/35 border-b px-6 font-serif text-lg">
            {signHere}
          </div>
        </div>
      </div>
    </div>
    <div className="ml-auto w-4/5 mask-radial-from-75% px-4 py-8">
      <div className="before:border-foreground/5 before:bg-primary/5 relative mt-auto aspect-2/3 h-fit overflow-hidden rounded-xl shadow-xl before:absolute before:inset-0 before:rounded-xl before:border sm:aspect-video md:aspect-2/3">
        <Image
          src={secondaryHero20BackgroundImage}
          alt={imageAlt}
          className="size-full object-cover"
          width={987}
          height={1481}
        />
      </div>
    </div>
  </div>
);
