import type { SchemaTypeDefinition } from "sanity";
import waitlistSettings from "./waitlist-settings";
import waitlistEntry from "./waitlist-entry";

export const schemaTypes: SchemaTypeDefinition[] = [
  waitlistSettings,
  waitlistEntry,
];
