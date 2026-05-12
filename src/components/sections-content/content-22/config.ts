import type { ContentBlock } from "./schema";

export const content22Key = "content-22" as const;
export const content22Namespace = "blocks.content-22" as const;

export const content22Sample: Omit<ContentBlock, "id"> = {
  type: "content-22",
  imageDarkSrc: "/placeholder.svg",
  imageLightSrc: "/placeholder.svg",
};
