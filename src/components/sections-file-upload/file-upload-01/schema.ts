import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/file-upload-01` — "Create a new project" card
 * with project-name + project-lead inputs, an image drop zone, and a
 * progress-tracked file list. All visible strings resolve through
 * `blocks.file-upload-01.*`. Per-lead avatar copy is keyed by `id`
 * against `leads.<id>.label`.
 */
export type FileUploadLead = {
  /** Stable identifier — also the `<SelectItem value>` and translation key. */
  id: string;
  /** Avatar image URL. */
  avatarSrc: string;
};

export type FileUploadBlock = {
  type: "file-upload-01";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /** Available project leads. Defaults to `fileUpload01Leads`. */
  leads?: FileUploadLead[];
  /** Pre-filled project name. */
  defaultProjectName?: string;
  /** Pre-selected lead `id`. */
  defaultLeadId?: string;
  /** Maximum upload size in bytes. Defaults to 4 MiB. */
  maxFileSize?: number;
  /** Accept attribute for the file input. Defaults to `image/*`. */
  accept?: string;
};
