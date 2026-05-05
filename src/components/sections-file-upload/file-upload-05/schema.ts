import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/file-upload-05` — minimal upload form: drop
 * zone + a "demo" completed-upload card + cancel/upload footer. All
 * visible strings resolve through `blocks.file-upload-05.*`.
 */
export type FileUploadBlock = {
  type: "file-upload-05";
  id: string;
  titleKey?: MessageKey;
  /** Accept attribute for the file input. */
  accept?: string;
};
