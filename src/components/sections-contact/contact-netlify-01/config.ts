import type { ContactNetlifyBlock } from "./schema";

export const contactNetlify01Key = "contact-netlify-01" as const;
export const contactNetlify01Namespace = "blocks.contact-netlify-01" as const;

export const contactNetlify01Sample: Omit<ContactNetlifyBlock, "id"> = {
  type: "contact-netlify-01",
  eyebrowKey: "blocks.contact-netlify-01.eyebrow",
  titleKey: "blocks.contact-netlify-01.title",
  bodyKey: "blocks.contact-netlify-01.body",
  nameLabelKey: "blocks.contact-netlify-01.nameLabel",
  namePlaceholderKey: "blocks.contact-netlify-01.namePlaceholder",
  emailLabelKey: "blocks.contact-netlify-01.emailLabel",
  emailPlaceholderKey: "blocks.contact-netlify-01.emailPlaceholder",
  messageLabelKey: "blocks.contact-netlify-01.messageLabel",
  messagePlaceholderKey: "blocks.contact-netlify-01.messagePlaceholder",
  submitLabelKey: "blocks.contact-netlify-01.submit",
  successKey: "blocks.contact-netlify-01.success",
  errorKey: "blocks.contact-netlify-01.error",
  privacyNoteKey: "blocks.contact-netlify-01.privacy",
};
