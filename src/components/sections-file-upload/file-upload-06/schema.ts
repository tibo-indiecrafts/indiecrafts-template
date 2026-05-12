import type { MessageKey } from "@/types/messages";

export type FileUploadStatus = "uploading" | "completed";

export type FileUploadUpload = {
  id: string;

  progress: number;
  status: FileUploadStatus;
};

export type FileUploadBlock = {
  type: "file-upload-06";
  id: string;

  dropMessageKey?: MessageKey;

  uploads?: FileUploadUpload[];

  accept?: string;
};
