/**
 * Collect every schema the page-builder contributes to the Studio.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/index.md
 */
import type { SchemaTypeDefinition } from "sanity";

// Documents (the `page` document is built by `definePage`, see `../index.ts`)
import quote from "./documents/quote";
import person from "./documents/person";

// Reusable objects
import blockContent from "./blockContent";
import cta from "./objects/cta";
import link from "./objects/link";

// The 17 generic page-builder modules
import { moduleSchemas } from "./modules";

/** Every fixed schema the page-builder contributes (all but `page` and the sidebar types). */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  quote,
  person,
  // Reusable objects
  blockContent,
  link,
  cta,
  // Modules
  ...moduleSchemas,
];
