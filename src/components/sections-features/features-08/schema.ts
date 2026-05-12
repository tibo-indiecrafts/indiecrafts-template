import type { MessageKey } from "@/types/messages";

export type FeaturesBlock = {
  type: "features-08";
  id: string;

  customizableKey?: MessageKey;

  secureTitleKey?: MessageKey;
  secureBodyKey?: MessageKey;

  fastTitleKey?: MessageKey;
  fastBodyKey?: MessageKey;

  chartTitleKey?: MessageKey;
  chartBodyKey?: MessageKey;

  safetyTitleKey?: MessageKey;
  safetyBodyKey?: MessageKey;

  safetyAvatars: readonly [
    { src: string; name: MessageKey },
    { src: string; name: MessageKey },
    { src: string; name: MessageKey },
  ];
};
