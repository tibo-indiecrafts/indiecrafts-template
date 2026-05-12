import type { MessageKey } from "@/types/messages";

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
