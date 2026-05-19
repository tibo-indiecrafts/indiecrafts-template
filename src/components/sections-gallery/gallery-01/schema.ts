import type { MessageKey } from "@/types/messages";

export type GalleryBlock = {
  type: "gallery-01";
  id: string;
  items: Array<{
    image: string;
    titleKey: MessageKey;
    descriptionKey: MessageKey;
  }>;
};
