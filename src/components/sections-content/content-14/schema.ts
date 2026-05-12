import type { MessageKey } from "@/types/messages";

export type ContentItem = {
  titleKey: MessageKey;
  bodyKey: MessageKey;
  altKey: MessageKey;
  image: {
    src: string;
    width: number;
    height: number;
  };
};

export type ContentBlock = {
  type: "content-14";
  id: string;
  items: ReadonlyArray<ContentItem>;
};
