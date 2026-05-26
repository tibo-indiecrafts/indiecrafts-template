/**
 * Sanity Studio configuration — used by the embedded Studio at /studio.
 *
 * Schema types live in `src/sanity/schema/`. Empty for now; the Studio
 * boots with a placeholder schema so you can log in and verify the
 * connection before modelling content.
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "./src/sanity/env";

export default defineConfig({
  basePath: studioBasePath,
  projectId,
  dataset,
  // Empty types list — add schemas under `src/sanity/schema/` then
  // import them into a `schema/index.ts` and spread here.
  schema: { types: [] },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
