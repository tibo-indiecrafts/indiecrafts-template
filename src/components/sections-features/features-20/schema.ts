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

export type FeaturesBlock = {
  type: "features-20";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  widgets: readonly [Widget, Widget, Widget];
};
