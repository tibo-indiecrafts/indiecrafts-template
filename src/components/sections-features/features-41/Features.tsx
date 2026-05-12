import * as React from "react";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { features41Namespace } from "./config";
import type { Features41Block } from "./schema";

/** Lightweight Card replacement matching Tailark's `variant="soft"` — no
 *  baked padding/border/shadow/flex; consumer controls the layout. */
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-xl", className)} {...props} />
);

/**
 * Tailark `mist-features-2` — JSX verbatim. Section heading + body
 * over a 3-column feature row (sm:grid-cols-2 md:grid-cols-3) where
 * each item is a stacked `Card` chrome (outer `aspect-video` soft
 * `bg-muted/40`, inner `bg-background` panel) above a title + body.
 * Each card has its own inner padding/translate variation. The
 * upstream's `<Card variant="soft">` was replaced with explicit
 * `bg-muted/40` since the project's shadcn `Card` doesn't expose a
 * `variant` prop.
 */
export default function Features({ id }: Readonly<Features41Block>) {
  const [t] = useScopedT(features41Namespace);

  return (
    <section aria-labelledby={`${id}-heading`}>
      <div className="bg-muted/50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div>
            <h2 id={`${id}-heading`} className="text-foreground text-4xl font-semibold">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mt-4 mb-12 text-lg text-balance">
              {t("body")}
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
            <div className="space-y-4">
              <Card className="bg-muted/40 aspect-video overflow-hidden px-6">
                <Card className="bg-background h-full translate-y-6" />
              </Card>
              <div className="sm:max-w-sm">
                <h3 className="text-foreground text-xl font-semibold">
                  {t("items.1.title")}
                </h3>
                <p className="text-muted-foreground my-4 text-lg">{t("items.1.body")}</p>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="bg-muted/40 aspect-video overflow-hidden p-6">
                <Card className="bg-background h-full" />
              </Card>
              <div className="sm:max-w-sm">
                <h3 className="text-foreground text-xl font-semibold">
                  {t("items.2.title")}
                </h3>
                <p className="text-muted-foreground my-4 text-lg">{t("items.2.body")}</p>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="bg-muted/40 aspect-video overflow-hidden">
                <Card className="bg-background h-full translate-6" />
              </Card>
              <div className="sm:max-w-sm">
                <h3 className="text-foreground text-xl font-semibold">
                  {t("items.3.title")}
                </h3>
                <p className="text-muted-foreground my-4 text-lg">{t("items.3.body")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
