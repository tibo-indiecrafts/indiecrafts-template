import type { SchemaTypeDefinition } from "sanity";

// Documents
import author from "./author";
import blog from "./documents/blog";
import category from "./category";
import form from "./documents/form";
import logo from "./documents/logo";
import person from "./documents/person";
import post from "./post";
import quote from "./documents/quote";

// Reusable objects
import blockContent from "./blockContent";
import cta from "./objects/cta";
import link from "./objects/link";
import metadata from "./objects/metadata";

// Blog page-builder modules (object types)
import { moduleSchemas } from "./modules";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  blog,
  post,
  author,
  category,
  quote,
  person,
  logo,
  form,
  // Reusable objects
  blockContent,
  metadata,
  link,
  cta,
  // Modules
  ...moduleSchemas,
];
