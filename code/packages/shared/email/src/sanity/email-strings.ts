import { defineType, type FieldDefinition } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

/**
 * E-mails (singleton) — the one place every transactional e-mail is configured:
 * who receives it, the sender, and the copy. **Subscriber-facing** copy (the
 * confirmations) is translated per language (`localeString`/`localeText`);
 * **internal** alerts (to the site team) keep a plain subject. The only secret
 * is `RESEND_API_KEY` (env). Read via `getEmailStrings()`.
 *
 * The document is **field-less on its own** — each email group is contributed by
 * its owning module via `SanityModule.emailGroups` and composed in here by
 * `emailSanity(modules)`. The brick never names a module; add or remove a module
 * from `composeSanity([...])` and its group appears or disappears.
 */
export function buildEmailStrings(groups: FieldDefinition[]) {
  return defineType({
    name: "emailStrings",
    title: "E-mails",
    type: "document",
    icon: EnvelopeIcon,
    __experimental_omnisearch_visibility: false,
    fields: groups,
    preview: {
      prepare: () => ({
        title: "E-mails",
        subtitle: "Réglages des e-mails transactionnels",
      }),
    },
  });
}
