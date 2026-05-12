import type { MessageKey } from "@/types/messages";

export type ContentBlock = {
  type: "content-17";
  id: string;
  titleKey: MessageKey;
  bodyKeys: ReadonlyArray<MessageKey>;
  image: {
    src: string;
    width: number;
    height: number;
    altKey: MessageKey;
  };
};
