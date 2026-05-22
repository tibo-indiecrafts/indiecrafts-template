import type { NewsletterBlock } from "./schema";

export const newsletter01Key = "newsletter-01" as const;
export const newsletter01Namespace = "blocks.newsletter-01" as const;

export const newsletter01Sample: Omit<NewsletterBlock, "id"> = {
  type: "newsletter-01",
  eyebrowKey: "blocks.newsletter-01.eyebrow",
  titleKey: "blocks.newsletter-01.title",
  bodyKey: "blocks.newsletter-01.body",
  emailPlaceholderKey: "blocks.newsletter-01.emailPlaceholder",
  submitLabelKey: "blocks.newsletter-01.submit",
  privacyNoteKey: "blocks.newsletter-01.privacy",
};
