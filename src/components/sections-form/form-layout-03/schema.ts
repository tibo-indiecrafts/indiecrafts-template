import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/form-layout-03` — three-stack settings form
 * with two-fieldset checkbox notification groups (team alerts + usage
 * alerts). All copy resolves through `blocks.form-layout-03.*`.
 */
export type FormLayoutBlock = {
  type: "form-layout-03";
  id: string;
  personalTitleKey?: MessageKey;
  personalDescriptionKey?: MessageKey;
  workspaceTitleKey?: MessageKey;
  workspaceDescriptionKey?: MessageKey;
  notificationsTitleKey?: MessageKey;
  notificationsDescriptionKey?: MessageKey;
};
