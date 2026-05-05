import type { Contact01Block } from "./schema";

export const contact01Key = "contact-01" as const;
export const contact01Namespace = "blocks.contact-01" as const;

/**
 * Default contact-1 instance. Emails and phone numbers are static contact
 * data — not translations — so they live here in config. Countries and job
 * option values are also locale-agnostic (the label is translated via
 * `labelKey`).
 */
export const contact01Sample: Omit<Contact01Block, "id"> = {
  type: "contact-01",
  titleKey: "blocks.contact-01.title",
  channels: [
    {
      titleKey: "blocks.contact-01.channels.sales",
      email: "hello@example.com",
      phone: "+1 (555) 555-0100",
    },
    {
      titleKey: "blocks.contact-01.channels.press",
      email: "press@example.com",
      phone: "+1 (555) 555-0101",
    },
  ],
  formTitleKey: "blocks.contact-01.form.title",
  formIntroKey: "blocks.contact-01.form.intro",
  nameLabelKey: "blocks.contact-01.form.name",
  emailLabelKey: "blocks.contact-01.form.email",
  countryLabelKey: "blocks.contact-01.form.country",
  countryPlaceholderKey: "blocks.contact-01.form.countryPlaceholder",
  countries: [
    { value: "us", labelKey: "blocks.contact-01.countries.us" },
    { value: "fr", labelKey: "blocks.contact-01.countries.fr" },
    { value: "cd", labelKey: "blocks.contact-01.countries.cd" },
    { value: "other", labelKey: "blocks.contact-01.countries.other" },
  ],
  websiteLabelKey: "blocks.contact-01.form.website",
  jobLabelKey: "blocks.contact-01.form.job",
  jobPlaceholderKey: "blocks.contact-01.form.jobPlaceholder",
  jobs: [
    { value: "finance", labelKey: "blocks.contact-01.jobs.finance" },
    { value: "education", labelKey: "blocks.contact-01.jobs.education" },
    { value: "legal", labelKey: "blocks.contact-01.jobs.legal" },
    { value: "other", labelKey: "blocks.contact-01.jobs.other" },
  ],
  messageLabelKey: "blocks.contact-01.form.message",
  submitKey: "blocks.contact-01.form.submit",
};
