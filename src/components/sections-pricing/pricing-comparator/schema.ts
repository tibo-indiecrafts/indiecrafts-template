import type { MessageKey } from "@/types/messages";

export type ComparatorIcon = "cpu" | "sparkles" | "shield" | "zap" | "globe";

/** A tier column in the comparator table header. */
export type ComparatorTier = {
  id: string;
  labelKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: string;
  /** Visually highlighted column (the "recommended" tier). */
  highlighted?: boolean;
};

/** One cell value: `true` renders a check, a MessageKey renders translated text, omit for empty. */
export type ComparatorCell = true | MessageKey | undefined;

export type ComparatorRow = {
  labelKey: MessageKey;
  /** Parallel array — one value per tier in the same order as the `tiers` array. */
  values: readonly ComparatorCell[];
};

export type ComparatorGroup = {
  iconKey: ComparatorIcon;
  labelKey: MessageKey;
  rows: readonly ComparatorRow[];
};

/**
 * Tailark `pricing-comparator` — a 3-tier feature comparison table.
 * Each tier column has its own label + CTA; rows are grouped under
 * an iconed section heading.
 */
export type PricingComparatorBlock = {
  type: "pricing-comparator";
  id: string;
  tiers: readonly [ComparatorTier, ComparatorTier, ComparatorTier];
  groups: readonly ComparatorGroup[];
  /** Screen-reader-only strings announced for check-mark / empty cells. */
  includedSrKey?: MessageKey;
  notIncludedSrKey?: MessageKey;
};
