import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

// Runs the tests INSIDE the Workers runtime (workerd), driven by the real
// wrangler.toml — so `cloudflare:test` `SELF` / `env` exercise the deployed worker
// and real bindings. Pinned to the vitest-3-compatible pool (0.8.x). See
// code/docs/apps/workers/.
export default defineWorkersConfig({
  test: {
    include: ["src/**/*.test.ts"],
    poolOptions: { workers: { wrangler: { configPath: "./wrangler.toml" } } },
  },
});
