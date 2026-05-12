import type { MessageKey } from "@/types/messages";

export type FileUploadVisibilityOption = {
  id: string;
};

export type FileUploadBlock = {
  type: "file-upload-03";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;

  visibilityOptions?: FileUploadVisibilityOption[];

  defaultVisibility?: string;
};
