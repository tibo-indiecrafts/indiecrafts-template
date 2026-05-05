import type { DialogBlock } from "./schema";

export const dialog11Key = "dialog-11" as const;
export const dialog11Namespace = "blocks.dialog-11" as const;

export const dialog11Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-11",
  defaultOpen: true,
};
