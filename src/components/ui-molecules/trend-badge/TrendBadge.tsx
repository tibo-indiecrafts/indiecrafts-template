import { TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui-primitives/badge";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import type { MessageKey } from "@/types/messages";
import { trendBadgeNamespace } from "./config";

export type TrendDirection = "up" | "down";

export type TrendBadgeProps = {
  /** "up" → green tone + TrendingUp icon. "down" → red tone + TrendingDown icon. */
  direction: TrendDirection;
  /** Pre-formatted display value (e.g. "+12%", "-3.4%"). Stays caller-side
   *  so the molecule is locale-agnostic — pass already-localized strings. */
  delta: ReactNode;
  /** Override the sr-only direction announcement. Defaults to local
   *  `trendUp` / `trendDown` keys. */
  srLabelKey?: MessageKey;
  /** Caller-side wrapper class (e.g. responsive margin tweaks). */
  className?: string;
};

/**
 * Tonal Badge with a TrendingUp/Down icon, a delta value, and an
 * sr-only direction label. Extracted from sections-stats/stats-{02,04}
 * where the same shape was duplicated.
 */
export function TrendBadge({
  direction,
  delta,
  srLabelKey,
  className,
}: Readonly<TrendBadgeProps>) {
  const [, tr] = useScopedT(trendBadgeNamespace);
  const isUp = direction === "up";
  const Icon = isUp ? TrendingUp : TrendingDown;
  const fallbackKey = isUp ? "trendUp" : "trendDown";

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 ps-2.5 text-xs font-medium tabular-nums",
        isUp
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        className,
      )}
    >
      <Icon
        className={cn(
          "mr-0.5 -ml-1 h-5 w-5 shrink-0 self-center",
          isUp ? "text-green-500" : "text-red-500",
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{tr(srLabelKey, fallbackKey)} </span>
      {delta}
    </Badge>
  );
}
