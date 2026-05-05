import type { DialogBlock } from "./schema";

export const dialog01Key = "dialog-01" as const;
export const dialog01Namespace = "blocks.dialog-01" as const;

export const dialog01Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-01",
  defaultOpen: true,
};
