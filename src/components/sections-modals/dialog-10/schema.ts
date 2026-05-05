import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-10` — schedule-meeting modal: title +
 * attendees + date picker + time select + location + description. All
 * copy resolves through `blocks.dialog-10.*`.
 */
export type DialogBlock = {
  type: "dialog-10";
  id: string;
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  meetingTitleLabelKey?: MessageKey;
  meetingTitlePlaceholderKey?: MessageKey;
  attendeesLabelKey?: MessageKey;
  attendeesPlaceholderKey?: MessageKey;
  attendeesHelpKey?: MessageKey;
  dateLabelKey?: MessageKey;
  datePlaceholderKey?: MessageKey;
  timeLabelKey?: MessageKey;
  timePlaceholderKey?: MessageKey;
  locationLabelKey?: MessageKey;
  locationPlaceholderKey?: MessageKey;
  descriptionLabelKey?: MessageKey;
  descriptionPlaceholderKey?: MessageKey;
  cancelKey?: MessageKey;
  submitKey?: MessageKey;
};
