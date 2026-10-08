/**
 * Lists the newsletter module's Sanity schema types.
 *
 * @see docs/reference/modules/web/newsletter/src/sanity/schema/index.md
 */
import type { SchemaTypeDefinition } from "sanity";
import newsletterSettings from "./newsletter-settings";
import leadMagnet from "./lead-magnet";

export const schemaTypes: SchemaTypeDefinition[] = [
  newsletterSettings,
  leadMagnet,
];
