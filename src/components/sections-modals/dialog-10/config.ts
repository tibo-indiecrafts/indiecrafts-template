import type { DialogBlock } from "./schema";

export const dialog10Key = "dialog-10" as const;
export const dialog10Namespace = "blocks.dialog-10" as const;

export const dialog10Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-10",
  defaultOpen: true,
};
