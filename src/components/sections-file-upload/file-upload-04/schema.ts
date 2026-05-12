import type { MessageKey } from "@/types/messages";

export type FileUploadBlock = {
  type: "file-upload-04";
  id: string;
  titleKey?: MessageKey;

  accept?: string;

  validMimeTypes?: string[];

  showDemoCard?: boolean;
};
