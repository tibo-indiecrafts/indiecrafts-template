"use client";

import {
  Bold,
  Calendar1,
  Ellipsis,
  Italic,
  Strikethrough,
  Underline,
} from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui-primitives/toggle-group";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { content30Namespace } from "./config";
import type { ContentBlock } from "./schema";

const CODE_SLOTS = ["1", "2", "3", "4", "5"] as const;

/**
 * Tailark `mist-content-2` — JSX verbatim. Editor-themed section
 * on `bg-muted/50 py-24` with eyebrow + title + body, then two
 * stacked rows separated by a hairline divider. Each row pairs an
 * illustration (left, `sm:col-span-2`) with title + body copy
 * (right, `sm:col-span-3 sm:border-l sm:pl-12`):
 *  - Row 1: `CodeIllustration` (radial-masked typography list with
 *    "Import" cue) → "Marketing Campaigns" copy
 *  - Row 2: `ScheduleIllustration` (floating toolbar with primary
 *    Schedule button + 4-toggle ToggleGroup + Ellipsis menu, above
 *    a sentence with a highlighted timestamp) → "AI Meeting
 *    Scheduler" copy
 */
export default function Content({ id }: Readonly<ContentBlock>) {
  const [t] = useScopedT(content30Namespace);
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="bg-muted/50 py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <span className="text-primary">{t("eyebrow")}</span>
            <h2 id={headingId} className="text-foreground mt-4 text-4xl font-semibold">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mt-4 mb-12 text-lg">{t("body")}</p>
          </div>

          <div className="border-foreground/5 space-y-6 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] sm:space-y-0 sm:divide-y">
            <div className="grid sm:grid-cols-5">
              <CodeIllustration t={t} className="sm:col-span-2" />
              <div className="mt-6 sm:col-span-3 sm:mt-0 sm:border-l sm:pl-12">
                <h3 className="text-foreground text-xl font-semibold">
                  {t("marketing.title")}
                </h3>
                <p className="text-muted-foreground mt-4 text-lg">
                  {t("marketing.body")}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-5">
              <div className="flex items-center justify-center pt-12 sm:col-span-2">
                <ScheduleIllustration t={t} className="pt-8" />
              </div>
              <div className="mt-6 sm:col-span-3 sm:mt-0 sm:border-l sm:pt-12 sm:pl-12">
                <h3 className="text-foreground text-xl font-semibold">
                  {t("scheduler.title")}
                </h3>
                <p className="text-muted-foreground mt-4 text-lg">
                  {t("scheduler.body")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type T = (key: string) => string;

const CodeIllustration = ({ t, className }: { t: T; className?: string }) => (
  <div
    className={cn(
      "[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)]",
      className,
    )}
  >
    <ul className="text-muted-foreground mx-auto w-fit font-mono text-2xl font-medium">
      {CODE_SLOTS.map((slot, index) => (
        <li
          key={slot}
          className={cn(
            index === 2 &&
              "text-foreground before:absolute before:-translate-x-[110%] before:text-orange-500",
          )}
          {...(index === 2
            ? {
                style: {
                  "--code-import-label": `'${t("code.import")}'`,
                } as React.CSSProperties & Record<string, string>,
              }
            : {})}
        >
          {index === 2 ? (
            <ImportLabel t={t}>{t(`code.items.${slot}`)}</ImportLabel>
          ) : (
            t(`code.items.${slot}`)
          )}
        </li>
      ))}
    </ul>
  </div>
);

const ImportLabel = ({ t, children }: { t: T; children: React.ReactNode }) => (
  <span className="relative">
    <span aria-hidden className="absolute -translate-x-[110%] text-orange-500">
      {t("code.import")}
    </span>
    {children}
  </span>
);

const ScheduleIllustration = ({ t, className }: { t: T; className?: string }) => (
  <div className={cn("relative", className)}>
    <div className="bg-background absolute flex -translate-x-1/8 -translate-y-[110%] items-center gap-2 rounded-lg p-1 shadow-lg shadow-black/10">
      <Button size="sm" className="rounded-sm">
        <Calendar1 className="size-3" />
        <span className="text-sm font-medium">{t("schedule.buttonLabel")}</span>
      </Button>
      <span aria-hidden className="bg-border block h-4 w-px" />
      <ToggleGroup type="multiple" size="sm" className="gap-0.5 *:rounded-md">
        <ToggleGroupItem value="bold" aria-label={t("schedule.boldLabel")}>
          <Bold className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label={t("schedule.italicLabel")}>
          <Italic className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label={t("schedule.underlineLabel")}>
          <Underline className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="strikethrough"
          aria-label={t("schedule.strikethroughLabel")}
        >
          <Strikethrough className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <span aria-hidden className="bg-border block h-4 w-px" />
      <Button
        size="icon"
        className="size-8"
        variant="ghost"
        aria-label={t("schedule.moreLabel")}
      >
        <Ellipsis className="size-3" />
      </Button>
    </div>
    <span>
      <span className="bg-secondary text-secondary-foreground py-1">
        {t("schedule.highlight")}
      </span>
      {t("schedule.trailing")}
    </span>
  </div>
);
