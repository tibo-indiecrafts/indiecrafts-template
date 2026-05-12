import type { ContentBlock } from "./schema";

export const content32Key = "content-32" as const;
export const content32Namespace = "blocks.content-32" as const;

export const content32Sample: Omit<ContentBlock, "id"> = {
  type: "content-32",
  backdropSrc:
    "https://images.unsplash.com/photo-1533119408463-b0f487583ff6?q=80&w=2960&auto=format&fit=crop",
  screenshotSrc: "/placeholder.svg",
};
