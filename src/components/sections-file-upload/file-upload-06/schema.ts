import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/file-upload-06` — drop-zone card with split
 * "Uploading" / "Finished" upload lists. Each upload's display name
 * resolves through `uploads.<id>.name`. All other visible strings
 * resolve through `blocks.file-upload-06.*`.
 */
export type FileUploadStatus = "uploading" | "completed";

export type FileUploadUpload = {
  /** Stable identifier — also the namespace key for the display name. */
  id: string;
  /** Initial progress (0–100). */
  progress: number;
  status: FileUploadStatus;
};

export type FileUploadBlock = {
  type: "file-upload-06";
  id: string;
  /** Drop-zone help/instruction copy. */
  dropMessageKey?: MessageKey;
  /** Override the seeded uploads. */
  uploads?: FileUploadUpload[];
  /** Accept attribute for the file input. */
  accept?: string;
};
