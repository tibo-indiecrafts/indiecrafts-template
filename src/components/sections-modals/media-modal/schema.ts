import type { MessageKey } from "@/types/messages";

export type MediaModalBlock = {
  type: "media-modal";
  id: string;
  imgSrc?: string;
  videoSrc?: string;
  titleKey: MessageKey;
  altKey?: MessageKey;
  closeLabelKey: MessageKey;
};
