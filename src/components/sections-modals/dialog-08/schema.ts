import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-08` — invite-members modal: title +
 * description + email-invite row + list of existing members. Member
 * names/emails are non-translatable PII; status uses a translatable
 * key under `blocks.dialog-08.status.*`.
 */
export type DialogStatus = "member" | "admin" | "guest";

export type DialogMember = {
  name: string;
  email: string;
  avatarUrl: string;
  initials: string;
  status: DialogStatus;
};

export type DialogBlock = {
  type: "dialog-08";
  id: string;
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  inviteSubmitKey?: MessageKey;
  inviteEmailPlaceholderKey?: MessageKey;
  membersHeadingKey?: MessageKey;
  members?: DialogMember[];
};
