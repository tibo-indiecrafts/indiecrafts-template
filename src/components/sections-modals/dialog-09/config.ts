import type { DialogBlock } from "./schema";

export const dialog09Key = "dialog-09" as const;
export const dialog09Namespace = "blocks.dialog-09" as const;

export const dialog09Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-09",
  defaultOpen: true,
  shareUrl: "https://writer.so/app/projects/123?share=true",
};
