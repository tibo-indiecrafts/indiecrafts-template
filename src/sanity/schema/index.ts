import type { SchemaTypeDefinition } from "sanity";
import author from "./author";
import blockContent from "./blockContent";
import category from "./category";
import metadata from "./objects/metadata";
import post from "./post";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  post,
  author,
  category,
  // Reusable objects
  blockContent,
  metadata,
];
