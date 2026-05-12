import type { MessageKey } from "@/types/messages";

export type FormLayoutBlock = {
  type: "form-layout-02";
  id: string;
  personalTitleKey?: MessageKey;
  personalDescriptionKey?: MessageKey;
  workspaceTitleKey?: MessageKey;
  workspaceDescriptionKey?: MessageKey;
  notificationsTitleKey?: MessageKey;
  notificationsDescriptionKey?: MessageKey;
};
