import type { DialogBlock } from "./schema";

export const dialog12Key = "dialog-12" as const;
export const dialog12Namespace = "blocks.dialog-12" as const;

export const dialog12Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-12",
  defaultOpen: true,
  defaultAuthorName: "Ephraim Duncan",
  defaultTitle: "Design Engineer",
  maxFileSize: 1_048_576,
};
