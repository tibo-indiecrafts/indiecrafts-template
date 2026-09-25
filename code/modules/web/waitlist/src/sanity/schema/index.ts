/**
 * Collect the waitlist schema types — the settings singleton and the entry document.
 *
 * @see docs/reference/modules/web/waitlist/src/sanity/schema/index.md
 */
import type { SchemaTypeDefinition } from "sanity";
import waitlistSettings from "./waitlist-settings";
import waitlistEntry from "./waitlist-entry";

export const schemaTypes: SchemaTypeDefinition[] = [
  waitlistSettings,
  waitlistEntry,
];
