import type { FileUploadBlock } from "./schema";

export const fileUpload05Key = "file-upload-05" as const;
export const fileUpload05Namespace = "blocks.file-upload-05" as const;

export const fileUpload05Sample: Omit<FileUploadBlock, "id"> = {
  type: "file-upload-05",
};
