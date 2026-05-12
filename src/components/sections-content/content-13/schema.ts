import type { MessageKey } from "@/types/messages";

export type ContentBlock = {
  type: "content-13";
  id: string;
  paragraphKeys: ReadonlyArray<MessageKey>;
  author: {
    avatarUrl: string;
    nameKey: MessageKey;
    roleKey: MessageKey;
  };
};
