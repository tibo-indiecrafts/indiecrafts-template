import type { DialogBlock } from "./schema";

export const dialog02Key = "dialog-02" as const;
export const dialog02Namespace = "blocks.dialog-02" as const;

export const dialog02Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-02",
  defaultOpen: true,
};
