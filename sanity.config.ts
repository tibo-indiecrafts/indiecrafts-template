/**
 * Sanity Studio configuration — used by the embedded Studio at /studio.
 *
 * Schema types live in `src/sanity/schema/`. The list ships with `post`,
 * `author`, `category`, `blockContent` (rich text) — ported from
 * GetNextjsTemplates/blog-forge.
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schema";

export default defineConfig({
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
