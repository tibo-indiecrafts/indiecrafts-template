import type { ContentBlock } from "./schema";

export const content28Key = "content-28" as const;
export const content28Namespace = "blocks.content-28" as const;

export const content28Sample: Omit<ContentBlock, "id"> = {
  type: "content-28",
  imageDarkSrc: "/placeholder.svg",
  imageLightSrc: "/placeholder.svg",
};
