import type { FileUploadBlock } from "./schema";

export const fileUpload04Key = "file-upload-04" as const;
export const fileUpload04Namespace = "blocks.file-upload-04" as const;

export const fileUpload04ValidMimeTypes = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const fileUpload04Sample: Omit<FileUploadBlock, "id"> = {
  type: "file-upload-04",
  accept: ".csv,.xlsx,.xls",
  validMimeTypes: fileUpload04ValidMimeTypes,
  showDemoCard: true,
};
