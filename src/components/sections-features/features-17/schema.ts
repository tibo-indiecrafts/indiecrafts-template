import type { MessageKey } from "@/types/messages";

export type FeaturesBlock = {
  type: "features-17";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  bodyMutedKey?: MessageKey;
};
