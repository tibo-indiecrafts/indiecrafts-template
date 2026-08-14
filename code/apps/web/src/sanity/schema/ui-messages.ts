import { defineField, defineType, type FieldDefinition } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";
import fallback from "../../../messages/en.json";

/**
 * Per-locale UI dictionary — fixed-id singletons (`uiMessages.en` /
 * `uiMessages.fr`) holding the app's chrome strings (nav, cookies, validation,
 * blog UI, system pages, …). The **primary edit surface** for that copy;
 * `messages/<locale>.json` stays bundled as a **fallback** only (resilience if
 * Sanity is unreachable). Fed to next-intl by `src/i18n/request.ts` (Sanity
 * overlaid on the bundled fallback), so every `t(...)` call site is unchanged.
 *
 * The schema's fields are **generated from the message shape** (`en.json`) so it
 * can't drift from the keys the app reads. `typography` is excluded — it's
 * machine i18n/format config (quote style, date format, oxford comma), not
 * editorial copy, and stays in the bundled file.
 */

// Top-level namespaces that are NOT editorial UI copy → never in the CMS.
const SKIP_TOP = new Set(["typography"]);

/** Humanise a camelCase key for a Studio field title. */
function humanise(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Build Sanity fields from a plain message object (strings → string fields). */
function fieldsFrom(obj: Record<string, unknown>, top = false): FieldDefinition[] {
  return Object.entries(obj)
    .filter(([k]) => !(top && SKIP_TOP.has(k)))
    .map(([k, v]) => {
      if (v !== null && typeof v === "object" && !Array.isArray(v)) {
        return defineField({
          name: k,
          title: humanise(k),
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: fieldsFrom(v as Record<string, unknown>),
        });
      }
      // Arrays/numbers/booleans only occur under `typography` (skipped); every
      // remaining leaf is a UI string (ICU placeholders kept verbatim).
      return defineField({ name: k, title: humanise(k), type: "string" });
    });
}

export default defineType({
  name: "uiMessages",
  title: "Textes de l'interface",
  type: "document",
  icon: HelpCircleIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
    ...fieldsFrom(fallback as Record<string, unknown>, true),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({
      title: "Textes de l'interface",
      subtitle: language ? String(language).toUpperCase() : undefined,
    }),
  },
});
