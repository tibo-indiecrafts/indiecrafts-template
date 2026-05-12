import type { MessageKey } from "@/types/messages";

export type ContentBlock = {
  type: "content-16";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  image: {
    src: string;
    width: number;
    height: number;
    altKey: MessageKey;
  };
};
