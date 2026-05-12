import type { ContentBlock } from "./schema";

export const content29Key = "content-29" as const;
export const content29Namespace = "blocks.content-29" as const;

export const content29Sample: Omit<ContentBlock, "id"> = {
  type: "content-29",
  imageDarkSrc: "/placeholder.svg",
  imageLightSrc: "/placeholder.svg",
};
