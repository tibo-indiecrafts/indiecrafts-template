import type { MessageKey } from "@/types/messages";

export type FileUploadBlock = {
  type: "file-upload-05";
  id: string;
  titleKey?: MessageKey;

  accept?: string;
};
