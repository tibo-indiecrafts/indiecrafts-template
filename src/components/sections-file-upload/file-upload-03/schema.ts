import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/file-upload-03` — cloud-storage setup card:
 * bucket-name + visibility-select + react-dropzone-powered drop zone
 * with selected-files list. All visible strings resolve through
 * `blocks.file-upload-03.*`. Per-visibility-option copy is keyed by
 * `id` against `visibility.<id>.label`.
 */
export type FileUploadVisibilityOption = {
  /** Stable identifier — also the `<SelectItem value>` and translation key. */
  id: string;
};

export type FileUploadBlock = {
  type: "file-upload-03";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /** Visibility options shown in the select. Defaults to private/public. */
  visibilityOptions?: FileUploadVisibilityOption[];
  /** Pre-selected visibility id. */
  defaultVisibility?: string;
};
