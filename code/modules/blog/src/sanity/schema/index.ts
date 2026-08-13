import type { SchemaTypeDefinition } from "sanity";

// Documents
import author from "./author";
import blog from "./documents/blog";
import category from "./category";
import tag from "./tag";
import person from "./documents/person";
import post from "./post";
import quote from "./documents/quote";
import comment from "./documents/comment";

// Reusable objects
import blockContent from "./blockContent";
import cta from "./objects/cta";
import link from "./objects/link";
import metadata from "./objects/metadata";
import seoMeta from "./objects/seo-meta";

// Blog page-builder modules (object types)
import { moduleSchemas } from "./modules";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  blog,
  post,
  author,
  category,
  tag,
  quote,
  person,
  comment,
  // Reusable objects
  blockContent,
  metadata,
  seoMeta,
  link,
  cta,
  // Modules
  ...moduleSchemas,
];
