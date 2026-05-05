import type { MessageKey } from "@/types/messages";

export type IdeIcon = "intellij" | "vsCode" | "windsurf";

/**
 * Tailark Pro `features-6` — left column: title + body + a small
 * "Native IDE Support" widget showing 3 IDE icons. Right column: a
 * tabbed code-block illustration with a sliding active-tab pill.
 * Converted to the template pattern: props-driven copy + IDE icon
 * triple, MessageKey-typed strings, theme tokens.
 */
export type FeaturesBlock = {
  type: "features-18";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ideListLabelKey: MessageKey;
  ides: readonly [IdeIcon, IdeIcon, IdeIcon];
};
