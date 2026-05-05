import type { FileUploadBlock, FileUploadLead } from "./schema";

export const fileUpload01Key = "file-upload-01" as const;
export const fileUpload01Namespace = "blocks.file-upload-01" as const;

export const fileUpload01Leads: FileUploadLead[] = [
  { id: "ephraim", avatarSrc: "https://blocks.so/avatar-01.png" },
  { id: "lucas", avatarSrc: "https://blocks.so/avatar-03.png" },
  { id: "timur", avatarSrc: "https://blocks.so/avatar-02.jpg" },
];

export const fileUpload01Sample: Omit<FileUploadBlock, "id"> = {
  type: "file-upload-01",
  leads: fileUpload01Leads,
  defaultProjectName: "Open Source Stripe",
  defaultLeadId: "ephraim",
  maxFileSize: 4 * 1024 * 1024,
  accept: "image/*",
};
