import { join } from "node:path";
import { defineCliConfig } from "sanity/cli";
import { siteOrigins } from "./scripts/lib/site-origins.mjs";

/**
 * Sanity CLI config — lets `sanity` subcommands (typegen, dataset export/import)
 * resolve the project + dataset from the same env the app uses. Schema-reading
 * commands (`schema extract`, `typegen`) read `sanity.config.ts` and need no network;
 * `dataset export/import` hit the API and need a token (see the content:* scripts).
 */

// `sanity build`/`deploy` bundles with Vite/Rollup, which honours Node's exports spec
// strictly. The workspace packages export `"./*": "./src/*"`, so a subpath like
// `@indiecrafts/x/sanity` may resolve to the `src/sanity` DIRECTORY (page-builder) OR a
// `src/sanity.ts` FILE (email). Rollup index-falls-back for neither; Next's transpiler
// does, which is why `next build` is fine. Try the direct path first (files resolve),
// and only when that fails retry `…/index` (directories) — so the hosted Studio builds
// without editing every package's exports map. (`vite` isn't resolvable as a type from
// this app, so the Rollup plugin context is typed structurally.)
type ResolveCtx = {
  resolve: (
    source: string,
    importer: string | undefined,
    options: { skipSelf: boolean },
  ) => Promise<{ id: string } | null>;
};

const workspaceIndexFallback = {
  name: "indiecrafts-workspace-index-fallback",
  enforce: "pre" as const,
  async resolveId(
    this: ResolveCtx,
    source: string,
    importer: string | undefined,
  ): Promise<string | null> {
    // The app's `@/*` tsconfig path alias (→ `src/*`) — Next reads tsconfig paths, the
    // Studio's Rollup build doesn't. `sanity deploy` runs from the app dir, so `src`
    // is under cwd. Resolve to the file (Rollup index-falls-back for real paths).
    if (source.startsWith("@/")) {
      const abs = join(process.cwd(), "src", source.slice(2));
      const r = await this.resolve(abs, importer, { skipSelf: true });
      return r?.id ?? null;
    }
    if (!source.startsWith("@indiecrafts/")) return null;
    const direct = await this.resolve(source, importer, { skipSelf: true });
    if (direct) return null; // resolves as-is (a file) — leave it to the default
    const fallback = await this.resolve(`${source}/index`, importer, { skipSelf: true });
    return fallback?.id ?? null;
  },
};

// `sanity build` passes only `SANITY_STUDIO_*` to the browser, but the shared config reads
// `NEXT_PUBLIC_*` (project id, dataset, site URL): without them the hosted Studio throws
// "Missing NEXT_PUBLIC_SANITY_PROJECT_ID" on load. They are public by definition.
const publicEnv = Object.fromEntries(
  Object.entries(process.env)
    .filter(([key]) => key.startsWith("NEXT_PUBLIC_"))
    .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
);

// The sites the hosted Studio's "Aperçu" tab may show: each env's website, prod first,
// then local dev (the same list `pnpm sanity:setup` adds to Sanity's CORS origins).
const previewOrigins = siteOrigins();

// The hosted Studio of each Sanity project (project id → Studio app id). It pins the
// deploy target, so `pnpm studio:deploy` does not ask again. Keyed by project, so a new
// project never deploys over another project's Studio: its first deploy asks for a
// hostname and prints the app id — add the pair here.
const STUDIO_APP_IDS: Record<string, string> = {
  qy2pp5sn: "q1mo279al0p9bwtt2pt24tdz", // indiecrafts.sanity.studio
};

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  deployment: { appId: STUDIO_APP_IDS[process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""] },
  vite: (config) => ({
    ...config,
    define: {
      ...config.define,
      ...publicEnv,
      "process.env.SANITY_STUDIO_PREVIEW_ORIGINS": JSON.stringify(
        previewOrigins.join(","),
      ),
    },
    plugins: [...(config.plugins ?? []), workspaceIndexFallback],
  }),
});
