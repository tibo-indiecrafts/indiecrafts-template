import type { MessageKey } from "@/types/messages";

export type FileUploadLead = {
  id: string;

  avatarSrc: string;
};

export type FileUploadBlock = {
  type: "file-upload-01";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;

  leads?: FileUploadLead[];

  defaultProjectName?: string;

  defaultLeadId?: string;

  maxFileSize?: number;

  accept?: string;
};
