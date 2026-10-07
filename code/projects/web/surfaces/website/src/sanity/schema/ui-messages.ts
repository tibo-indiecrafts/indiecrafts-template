/**
 * Defines the per-locale UI dictionary schema, generated from the message shape.
 *
 * @see docs/reference/projects/web/website/src/sanity/schema/ui-messages.md
 */
import { defineField, defineType, type FieldDefinition } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
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
 * editorial copy, and stays in the bundled file. `moderation` is excluded too:
 * the owner-only moderation page reads the bundled file directly (no Sanity call).
 */

// Top-level namespaces that are NOT editorial UI copy → never in the CMS.
const SKIP_TOP = new Set(["typography", "moderation"]);

// Sanity field names must match this (letters/digits/underscore, letter-first). A few
// message keys are kebab-case ids reused as keys — e.g. the GDPR request type
// `legal.dataRequest.types.withdraw-consent` (the `-` is invalid, and the key can't be
// renamed: the app looks the label up by the type id). Such keys are dropped from the
// CMS schema and stay bundled-only — the i18n overlay falls back to messages/<locale>.json
// for any key Sanity doesn't carry, so the label still renders.
const VALID_FIELD_NAME = /^[A-Za-z][0-9A-Za-z_]*$/;

/** Humanise a camelCase key for a Studio field title. */
function humanise(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Build Sanity fields from a plain message object (strings → string fields). */
function fieldsFrom(obj: Record<string, unknown>, top = false): FieldDefinition[] {
  return Object.entries(obj)
    .filter(([k]) => !(top && SKIP_TOP.has(k)))
    .filter(([k]) => VALID_FIELD_NAME.test(k)) // kebab ids (e.g. withdraw-consent) stay bundled-only
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
