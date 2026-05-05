import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui-primitives/card";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export type ActionCardTone =
  | "primary"
  | "muted"
  | "green"
  | "red"
  | "blue"
  | "sky"
  | "pink"
  | "orange";

export type ActionCardVariant = "compact" | "tile";

export type ActionCardProps = {
  /** Lucide icon rendered in the tinted bubble. */
  icon: LucideIcon;
  /** Card heading. Localized by the caller. */
  title: ReactNode;
  /** Optional supporting body. */
  description?: ReactNode;
  /** Optional href. When set, renders a card-spanning Link via the typed
   *  next-intl helper so internal routes get client-side navigation.
   *  Caller passes the full path; the molecule casts to satisfy the typed
   *  Link signature. */
  href?: string;
  /** "compact" — size-9 rounded-md icon bubble, p-4 card, hover affordance.
   *  Used for dense quick-action grids.
   *  "tile" — p-3 ring-2 rounded-lg icon bubble, p-6 card, decorative
   *  accent slot. Used for hero-style help-center / category tiles.
   *  Default: "compact". */
  variant?: ActionCardVariant;
  /** Tone applied to the icon bubble. Defaults to "primary".
   *  TODO(audit-item-4): tone→class mapping is currently TS-baked. If a
   *  third or fourth tone palette appears, lift this into themeConfig. */
  tone?: ActionCardTone;
  /** Decorative corner accent (e.g. an ArrowUpRight icon). Only rendered
   *  in "tile" variant. */
  cornerAccent?: ReactNode;
  /** Caller-side wrapper class. */
  className?: string;
};

const TONE_CLASSES: Record<ActionCardTone, { fg: string; bg: string; ring: string }> = {
  primary: { fg: "text-primary", bg: "bg-primary/10", ring: "" },
  muted: { fg: "text-muted-foreground", bg: "bg-muted", ring: "" },
  green: {
    fg: "text-green-700",
    bg: "bg-green-50 dark:bg-green-950/30",
    ring: "ring-green-700/30",
  },
  red: {
    fg: "text-red-700",
    bg: "bg-red-50 dark:bg-red-950/30",
    ring: "ring-red-700/30",
  },
  blue: {
    fg: "text-blue-700",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    ring: "ring-blue-700/30",
  },
  sky: {
    fg: "text-sky-700",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    ring: "ring-sky-700/30",
  },
  pink: {
    fg: "text-pink-700",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    ring: "ring-pink-700/30",
  },
  orange: {
    fg: "text-orange-700",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    ring: "ring-orange-700/30",
  },
};

/**
 * Icon-titled card with optional description and card-spanning click
 * target. Extracted from sections-dashboard/quick-actions-01 (compact)
 * and sections-lists/grid-list-03 (tile) which were structurally
 * identical but differed in size, tone palette, and corner accent.
 *
 * Uses the canonical card-spanning anchor pattern: `<Link>` lives
 * inside the card with an `absolute inset-0` overlay span — the entire
 * card surface becomes clickable while the focusable element remains
 * the link itself.
 */
export function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  variant = "compact",
  tone = "primary",
  cornerAccent,
  className,
}: Readonly<ActionCardProps>) {
  const palette = TONE_CLASSES[tone];
  const isTile = variant === "tile";
  const hasRing = isTile && palette.ring !== "";

  const iconBubble = (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        isTile ? "rounded-lg p-3" : "size-9 rounded-md",
        hasRing && "ring-2 ring-inset",
        palette.bg,
        palette.fg,
        hasRing && palette.ring,
      )}
      aria-hidden="true"
    >
      <Icon className={isTile ? "size-6" : "size-4"} />
    </span>
  );

  const titleNode = href ? (
    <Link
      href={href as Parameters<typeof Link>[0]["href"]}
      className="focus:outline-none"
    >
      <span aria-hidden="true" className="absolute inset-0" />
      {title}
    </Link>
  ) : (
    title
  );

  return (
    <Card
      className={cn(
        "focus-within:ring-ring relative",
        isTile
          ? "group rounded-xl border-0 p-0 shadow-none focus-within:ring-2 focus-within:ring-inset"
          : "group hover:bg-accent/40 focus-visible:bg-accent/40 h-full transition-colors",
        className,
      )}
    >
      <CardContent className={cn(isTile ? "p-6" : "flex flex-col gap-2 p-4")}>
        {isTile ? (
          <>
            <div>{iconBubble}</div>
            <div className="mt-4">
              <h3 className="text-foreground text-base font-semibold text-balance">
                {titleNode}
              </h3>
              {description ? (
                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  {description}
                </p>
              ) : null}
            </div>
            {cornerAccent ? (
              <span
                aria-hidden="true"
                className="text-muted-foreground/50 group-hover:text-muted-foreground/60 pointer-events-none absolute top-6 right-6"
              >
                {cornerAccent}
              </span>
            ) : null}
          </>
        ) : (
          <>
            {iconBubble}
            <span className="text-foreground text-sm font-medium">{titleNode}</span>
            {description ? (
              <span className="text-muted-foreground text-xs leading-snug text-pretty">
                {description}
              </span>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
