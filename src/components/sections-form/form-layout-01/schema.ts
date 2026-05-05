import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/form-layout-01` — single-card register-to-
 * workspace form: title + subtitle + name/email/address fields +
 * cancel/submit footer. All copy resolves through
 * `blocks.form-layout-01.*`.
 */
export type FormLayoutBlock = {
  type: "form-layout-01";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
};
