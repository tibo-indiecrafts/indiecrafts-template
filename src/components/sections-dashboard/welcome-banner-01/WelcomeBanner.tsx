import {
  BookOpen,
  Cog,
  LifeBuoy,
  Rocket,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui-primitives/card";
import { Link } from "@/i18n/routing";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { welcomeBanner01Chips, welcomeBanner01Namespace } from "./config";
import type { WelcomeBannerBlock, WelcomeBannerIcon } from "./schema";

const ICONS: Record<WelcomeBannerIcon, LucideIcon> = {
  Sparkles,
  BookOpen,
  Cog,
  LifeBuoy,
  Rocket,
  Zap,
};

const CHIP_CLASSES = cn(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-background/60 px-3 py-1.5 text-xs font-medium",
  "text-foreground transition-colors",
  "hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:outline-none",
);

/**
 * Welcome-banner dashboard section — personalized greeting card with a
 * salutation, status line, and a horizontally scrollable row of
 * quick-action chips. Pairs naturally above the KPI cards on admin
 * dashboards. `userName` is per-session data; everything else is
 * translatable.
 */
export default function WelcomeBanner(props: Readonly<WelcomeBannerBlock>) {
  const [t, tr] = useScopedT(welcomeBanner01Namespace);
  const chips = props.chips ?? welcomeBanner01Chips;
  const titleId = `${props.id}-title`;
  const name = props.userName ?? tr(props.greetingKey, "greeting");

  return (
    <section
      aria-labelledby={titleId}
      className="px-(--gutter) pt-6 pb-2 md:pt-8 md:pb-3"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Card className="from-primary/5 to-card border-primary/10 bg-gradient-to-br p-5 md:p-6">
          <CardContent className="flex flex-col gap-4 p-0">
            <header className="flex flex-col gap-1">
              <h2
                id={titleId}
                className="text-foreground text-xl font-semibold tracking-tight md:text-2xl"
              >
                {tr(props.titleKey, "title", { name })}
              </h2>
              <p className="text-muted-foreground text-sm text-pretty">
                {tr(props.descriptionKey, "description")}
              </p>
            </header>
            {chips.length > 0 ? (
              <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {chips.map((chip) => {
                  const Icon = ICONS[chip.iconKey];
                  const inner = (
                    <>
                      <Icon className="size-3.5" aria-hidden="true" />
                      <span>{t(`chips.${chip.id}.label`)}</span>
                    </>
                  );
                  return (
                    <li key={chip.id} className="shrink-0">
                      {chip.href ? (
                        <Link
                          href={chip.href as Parameters<typeof Link>[0]["href"]}
                          className={CHIP_CLASSES}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <button type="button" className={CHIP_CLASSES}>
                          {inner}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
