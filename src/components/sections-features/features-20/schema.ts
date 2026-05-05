import type { MessageKey } from "@/types/messages";

export type WidgetIcon =
  | "intellij"
  | "vsCode"
  | "windsurf"
  | "gemini"
  | "claude"
  | "openAi";

export type IconsWidget = {
  kind: "icons";
  titleKey: MessageKey;
  icons: readonly [WidgetIcon, WidgetIcon, WidgetIcon];
};

export type CodeWidget = {
  kind: "code";
  titleKey: MessageKey;
  /**
   * Rich-text body. The translation may use `<command>...</command>`
   * and `<flag>...</flag>` tags to render inline `<code>` chips with
   * accent colours.
   */
  bodyKey: MessageKey;
};

export type Widget = IconsWidget | CodeWidget;

/**
 * Tailark Pro `features-8` — the same masked-frame layout as
 * `features-7` but the stat row is replaced by 3 mixed widgets: two
 * icon-triple cards (e.g. IDEs / LLMs) and one CLI snippet card with
 * inline accent-coloured `<code>` chips. Converted to the template
 * pattern: props-driven widgets via a discriminated union, MessageKey-
 * typed strings, theme tokens.
 */
export type FeaturesBlock = {
  type: "features-20";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  widgets: readonly [Widget, Widget, Widget];
};
