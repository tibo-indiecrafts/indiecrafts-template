import { Mail, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { useScopedT } from "@/components/_lib/scoped-t";
import {
  secondaryHero12Namespace,
  secondaryHero12SalesHref,
  secondaryHero12SupportHref,
} from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero12Namespace);

  return (
    <section aria-labelledby="secondary-hero-12-title" className="bg-background py-24">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-primary bg-primary/5 border-primary/10 rounded-full border px-2 py-1 text-sm font-medium">
            {t("tag")}
          </span>
          <h1
            id="secondary-hero-12-title"
            className="mt-4 text-4xl font-semibold text-balance md:text-5xl lg:text-6xl lg:tracking-tight"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg text-balance">{t("body")}</p>

          <div className="ring-border bg-card/25 relative mx-auto mt-12 grid max-w-xl overflow-hidden rounded-xl text-left shadow-md ring-1 *:p-6 @max-xl:divide-y @xl:grid-cols-2 @xl:divide-x">
            <div className="row-span-4 grid grid-rows-subgrid gap-4">
              <div className="bg-card/25 ring-border flex size-8 rounded-md text-emerald-600 shadow ring-1 shadow-emerald-500/25">
                <Mail className="m-auto size-4 *:fill-emerald-500/15" aria-hidden />
              </div>
              <h2 className="font-medium">{t("cards.sales.title")}</h2>
              <p className="text-muted-foreground text-balance">
                {t("cards.sales.description")}
              </p>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link
                  href={secondaryHero12SalesHref as Parameters<typeof Link>[0]["href"]}
                >
                  {t("cards.sales.cta")}
                </Link>
              </Button>
            </div>
            <div className="row-span-4 grid grid-rows-subgrid gap-4">
              <div className="bg-card/25 ring-border flex size-8 rounded-md text-indigo-600 shadow ring-1 shadow-indigo-500/25">
                <MessageCircleQuestion
                  className="m-auto size-4 *:fill-indigo-500/15"
                  aria-hidden
                />
              </div>
              <h2 className="text-lg font-medium">{t("cards.support.title")}</h2>
              <p className="text-muted-foreground text-balance">
                {t("cards.support.description")}
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link
                  href={secondaryHero12SupportHref as Parameters<typeof Link>[0]["href"]}
                >
                  {t("cards.support.cta")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
