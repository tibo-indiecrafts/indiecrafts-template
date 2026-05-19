import type { MessageKey } from "@/types/messages";

export type BentoBlock = {
  type: "bento-15";
  id: string;
  titleKey: MessageKey;
  items: Array<{
    image: string;
    titleKey: MessageKey;
  }>;
};
