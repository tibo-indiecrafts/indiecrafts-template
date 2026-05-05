import type { DialogBlock } from "./schema";

export const dialog05Key = "dialog-05" as const;
export const dialog05Namespace = "blocks.dialog-05" as const;

export const dialog05Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-05",
  defaultOpen: true,
};
