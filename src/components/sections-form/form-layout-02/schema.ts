import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/form-layout-02` — three-stack settings form
 * (personal info / workspace / newsletter radio). Each stack pairs a
 * left-hand caption with a right-hand fieldset; copy resolves through
 * `blocks.form-layout-02.*`.
 */
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
