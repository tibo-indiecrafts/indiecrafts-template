import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type FeaturesExpandableItem = {
  /** Decorative bg image painted (with dither overlay) behind the hero card. */
  bgImageUrl: string;
  /** Tab label shown inside the segmented control. */
  tabLabelKey: MessageKey;
  /** Per-item title shown BELOW the hero card. */
  titleKey: MessageKey;
  /** Per-item body shown next to the title (2-col grid). */
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-22` — click-driven 3-tab variant
 * with three signature pieces:
 *   1) **Animated segmented control** — text-only tab pills inside a
 *      `bg-muted` rounded shell. A `motion.div` indicator measures the
 *      active button's `offsetLeft` / `offsetWidth` and slides between
 *      tabs (spring stiffness 400, damping 30).
 *   2) **Single shared "Learn more" CTA** sitting in the right column
 *      of the tab row — independent of which tab is active.
 *   3) **Decorative hero with NO illustration component** — two
 *      placeholder cards (`bg-card` + `bg-illustration`) overlap with
 *      `-space-x-20` to mock a device stack. The shape is identical
 *      across tabs; only the dithered bg image swaps. Below the hero,
 *      the active tab's per-item title + body display in a 2-col row.
 *
 * Three items is structural — the segmented control's spring
 * indicator and the visual rhythm both balance for three. No
 * autoplay (manual click only).
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-22";
  id: string;
  /** Section heading at the top. */
  headerTitleKey: MessageKey;
  /** Section subhead. */
  headerBodyKey: MessageKey;
  /** Single shared CTA label sitting next to the segmented control. */
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
