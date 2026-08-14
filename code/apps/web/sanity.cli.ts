import { defineCliConfig } from "sanity/cli";

/**
 * Sanity CLI config — lets `sanity` subcommands (typegen, dataset export/import)
 * resolve the project + dataset from the same env the app uses. Schema-reading
 * commands (`schema extract`, `typegen`) read `sanity.config.ts` and need no network;
 * `dataset export/import` hit the API and need a token (see the content:* scripts).
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
