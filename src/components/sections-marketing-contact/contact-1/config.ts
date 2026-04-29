import type { Contact1Block } from "./schema";

/**
 * Default contact-1 instance. Emails and phone numbers are static contact
 * data — not translations — so they live here in config. Countries and job
 * option values are also locale-agnostic (the label is translated via
 * `labelKey`).
 */
export const contact1Sample: Omit<Contact1Block, "id"> = {
  type: "contact-1",
  titleKey: "blocks.contact-1.title",
  channels: [
    {
      titleKey: "blocks.contact-1.channels.sales",
      email: "hello@example.com",
      phone: "+1 (555) 000-0000",
    },
    {
      titleKey: "blocks.contact-1.channels.press",
      email: "press@example.com",
      phone: "+1 (555) 000-0001",
    },
  ],
  formTitleKey: "blocks.contact-1.form.title",
  formIntroKey: "blocks.contact-1.form.intro",
  nameLabelKey: "blocks.contact-1.form.name",
  emailLabelKey: "blocks.contact-1.form.email",
  countryLabelKey: "blocks.contact-1.form.country",
  countryPlaceholderKey: "blocks.contact-1.form.countryPlaceholder",
  countries: [
    { value: "us", labelKey: "blocks.contact-1.countries.us" },
    { value: "fr", labelKey: "blocks.contact-1.countries.fr" },
    { value: "cd", labelKey: "blocks.contact-1.countries.cd" },
    { value: "other", labelKey: "blocks.contact-1.countries.other" },
  ],
  websiteLabelKey: "blocks.contact-1.form.website",
  jobLabelKey: "blocks.contact-1.form.job",
  jobPlaceholderKey: "blocks.contact-1.form.jobPlaceholder",
  jobs: [
    { value: "finance", labelKey: "blocks.contact-1.jobs.finance" },
    { value: "education", labelKey: "blocks.contact-1.jobs.education" },
    { value: "legal", labelKey: "blocks.contact-1.jobs.legal" },
    { value: "other", labelKey: "blocks.contact-1.jobs.other" },
  ],
  messageLabelKey: "blocks.contact-1.form.message",
  submitKey: "blocks.contact-1.form.submit",
};
