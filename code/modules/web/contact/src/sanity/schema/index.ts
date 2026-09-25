/**
 * Collect the contact module's Sanity schema types into one array.
 *
 * @see docs/reference/modules/web/contact/src/sanity/schema/index.md
 */
import type { SchemaTypeDefinition } from "sanity";
import contactSettings from "./contact-settings";
import contactMessage from "./contact-message";

export const schemaTypes: SchemaTypeDefinition[] = [
  contactSettings,
  contactMessage,
];
