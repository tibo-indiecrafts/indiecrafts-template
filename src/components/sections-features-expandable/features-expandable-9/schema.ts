import type { MessageKey } from "@/types/messages";
import type { SceneDevice } from "@/components/ui-illustrations/scene-illustration";

export type FeaturesExpandableItem = {
  /** Which SVG group in the SceneIllustration this row binds to. */
  device: SceneDevice;
  /**
   * Bold lead label rendered both as the collapsed pill text AND as
   * the prefix on the expanded body. The expanded paragraph reads
   * "<strong>{title}.</strong> {body}".
   */
  titleKey: MessageKey;
  /** Description shown only when the row is expanded. */
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-9` — left column has a
 * `LayoutGroup`-animated stack of 5 collapsible pills (one per
 * infrastructure tier — Server / Router / Database / Tab / Mobile);
 * clicking a pill expands it into a card with title + description and
 * floats up/down chevron buttons next to it. Right column is the
 * isometric SceneIllustration which highlights the matching device
 * (full opacity + 1.1 scale, others dimmed to 25%, platform faded to
 * 50%).
 *
 * Five items is structural — the SceneIllustration ships with five
 * device groups. The `device` discriminator picks which SVG group
 * each pill binds to; consumers can reorder rows or skip a row by
 * passing fewer items, but the SVG always has the five groups.
 * Converted to the template pattern: props-driven items, MessageKey-
 * typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-9";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
