import type { DialogBlock } from "./schema";

export const dialog07Key = "dialog-07" as const;
export const dialog07Namespace = "blocks.dialog-07" as const;

export const dialog07Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-07",
  defaultOpen: true,
  email: "name@example.com",
};
