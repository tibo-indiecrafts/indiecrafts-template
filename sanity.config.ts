/**
 * Sanity Studio configuration — embedded Studio at /studio.
 *
 * Schemas live under `src/sanity/schema/`; the Studio sidebar layout
 * lives in `src/sanity/structure.ts`. Ported from
 * GetNextjsTemplates/blog-forge then enhanced with patterns from
 * nuotsu/sanitypress-with-typegen (metadata object, groups, orderings,
 * sidebar structure).
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schema";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
