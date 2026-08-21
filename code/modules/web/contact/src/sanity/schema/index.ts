import type { SchemaTypeDefinition } from "sanity";
import contactSettings from "./contact-settings";
import contactMessage from "./contact-message";

export const schemaTypes: SchemaTypeDefinition[] = [
  contactSettings,
  contactMessage,
];
