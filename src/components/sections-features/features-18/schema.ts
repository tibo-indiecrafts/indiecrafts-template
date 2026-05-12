import type { MessageKey } from "@/types/messages";

export type IdeIcon = "intellij" | "vsCode" | "windsurf";

export type FeaturesBlock = {
  type: "features-18";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ideListLabelKey: MessageKey;
  ides: readonly [IdeIcon, IdeIcon, IdeIcon];
};
