import type { DialogBlock } from "./schema";

export const dialog06Key = "dialog-06" as const;
export const dialog06Namespace = "blocks.dialog-06" as const;

export const dialog06Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-06",
  defaultOpen: true,
};
