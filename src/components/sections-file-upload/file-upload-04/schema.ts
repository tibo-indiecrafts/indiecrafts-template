import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/file-upload-04` — single-file spreadsheet
 * upload form with progress card. Renders a static "demo" card by
 * default until the user selects a real file. All visible strings
 * resolve through `blocks.file-upload-04.*`.
 */
export type FileUploadBlock = {
  type: "file-upload-04";
  id: string;
  titleKey?: MessageKey;
  /** Accept attribute for the file input. Defaults to `.csv,.xlsx,.xls`. */
  accept?: string;
  /** Whitelisted MIME types. */
  validMimeTypes?: string[];
  /** Show the static "demo" upload card initially. Defaults to true. */
  showDemoCard?: boolean;
};
