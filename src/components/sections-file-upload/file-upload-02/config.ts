import type { FileUploadBlock } from "./schema";

export const fileUpload02Key = "file-upload-02" as const;
export const fileUpload02Namespace = "blocks.file-upload-02" as const;

export const fileUpload02Sample: Omit<FileUploadBlock, "id"> = {
  type: "file-upload-02",
  accept: ".csv,.xlsx,.xls",
};
