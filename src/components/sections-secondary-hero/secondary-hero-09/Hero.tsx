import { Search } from "lucide-react";
import { useScopedT } from "@/components/_lib/scoped-t";
import { secondaryHero09Namespace } from "./config";

export function Hero() {
  const [t] = useScopedT(secondaryHero09Namespace);

  return (
    <section aria-labelledby="secondary-hero-09-title" className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-primary bg-primary/5 border-primary/10 rounded-full border px-2 py-1 text-sm font-medium">
            {t("tag")}
          </span>
          <h1
            id="secondary-hero-09-title"
            className="mt-4 text-4xl font-semibold text-balance md:text-5xl lg:text-6xl lg:tracking-tight"
          >
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-4 mb-6 text-lg text-balance">
            {t("body")}
          </p>

          <form role="search" className="relative mx-auto max-w-lg">
            <label htmlFor="secondary-hero-09-search" className="sr-only">
              {t("searchLabel")}
            </label>
            <Search
              aria-hidden
              className="absolute top-1/2 left-5 size-4 -translate-y-1/2"
            />
            <input
              type="search"
              name="search"
              id="secondary-hero-09-search"
              className="focus:ring-primary border-foreground/15 h-14 w-full rounded-full border py-3 pr-4 pl-12 outline-none focus:border-transparent focus:ring-2"
              placeholder={t("searchPlaceholder")}
            />
          </form>
        </div>
      </div>
    </section>
  );
}
