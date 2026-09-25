/**
 * Collect every schema the page-builder contributes to the Studio.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/index.md
 */
import type { SchemaTypeDefinition } from "sanity";

// Documents
import page from "./page";
import quote from "./documents/quote";
import person from "./documents/person";

// Reusable objects
import blockContent from "./blockContent";
import cta from "./objects/cta";
import link from "./objects/link";

// The 16 generic page-builder modules
import { moduleSchemas } from "./modules";

/** Every schema the page-builder contributes to the Studio. */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  page,
  quote,
  person,
  // Reusable objects
  blockContent,
  link,
  cta,
  // Modules
  ...moduleSchemas,
];
