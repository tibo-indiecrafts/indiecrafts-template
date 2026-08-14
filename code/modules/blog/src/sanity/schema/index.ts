import type { SchemaTypeDefinition } from "sanity";

// Documents
import author from "./author";
import blog from "./documents/blog";
import category from "./category";
import tag from "./tag";
import series from "./series";
import person from "./documents/person";
import post from "./post";
import quote from "./documents/quote";
import comment from "./documents/comment";

// Reusable objects (shared `localeString` + `seoMeta` live in @indiecrafts/schema)
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
  tag,
  series,
  quote,
  person,
  comment,
  // Reusable objects
  blockContent,
  metadata,
  link,
  cta,
  // Modules
  ...moduleSchemas,
];
