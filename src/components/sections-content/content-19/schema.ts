import type { MessageKey } from "@/types/messages";

export type ContentBlock = {
  type: "content-19";
  id: string;
  paragraphKeys: ReadonlyArray<MessageKey>;
  readMoreLabelKey: MessageKey;
  readLessLabelKey: MessageKey;
};
