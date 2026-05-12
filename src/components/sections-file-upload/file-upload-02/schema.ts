import type { MessageKey } from "@/types/messages";

export type FileUploadBlock = {
  type: "file-upload-02";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;

  accept?: string;
};
