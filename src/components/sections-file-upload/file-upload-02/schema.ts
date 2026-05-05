import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/file-upload-02` — minimal workspace setup
 * card: workspace name input + a single file input with accept
 * filter, plus cancel / submit footer. All visible strings resolve
 * through `blocks.file-upload-02.*`.
 */
export type FileUploadBlock = {
  type: "file-upload-02";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /** Accept attribute for the file input. Defaults to `.csv,.xlsx,.xls`. */
  accept?: string;
};
