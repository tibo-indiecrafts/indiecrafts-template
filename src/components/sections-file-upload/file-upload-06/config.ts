import type { FileUploadBlock, FileUploadUpload } from "./schema";

export const fileUpload06Key = "file-upload-06" as const;
export const fileUpload06Namespace = "blocks.file-upload-06" as const;

export const fileUpload06Uploads: FileUploadUpload[] = [
  { id: "design", progress: 62, status: "uploading" },
  { id: "headshot", progress: 28, status: "uploading" },
  { id: "logo", progress: 100, status: "completed" },
];

export const fileUpload06Sample: Omit<FileUploadBlock, "id"> = {
  type: "file-upload-06",
  uploads: fileUpload06Uploads,
  accept: "image/png,image/jpeg,image/gif",
};
