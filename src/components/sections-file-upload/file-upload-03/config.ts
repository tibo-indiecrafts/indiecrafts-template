import type { FileUploadBlock, FileUploadVisibilityOption } from "./schema";

export const fileUpload03Key = "file-upload-03" as const;
export const fileUpload03Namespace = "blocks.file-upload-03" as const;

export const fileUpload03VisibilityOptions: FileUploadVisibilityOption[] = [
  { id: "private" },
  { id: "public" },
];

export const fileUpload03Sample: Omit<FileUploadBlock, "id"> = {
  type: "file-upload-03",
  visibilityOptions: fileUpload03VisibilityOptions,
  defaultVisibility: "private",
};
