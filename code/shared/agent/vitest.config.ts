import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

// Runs the tests INSIDE the Workers runtime (workerd), driven by the real
// wrangler.toml — so `cloudflare:test` `SELF` / `env` exercise the deployed worker
// and real bindings. Pinned to the vitest-3-compatible pool (0.8.x). See
// code/docs/apps/workers/.
//
// `environment: "dev"` picks up the real `AGENT_RATELIMIT` binding (`env.dev` in
// wrangler.toml — the top-level config has none, see its comment) so the 429 test
// exercises the actual rate limiter. The three secrets aren't in wrangler.toml (they're
// `wrangler secret put`-only) — `miniflare.bindings` injects test values for them here.
export default defineWorkersConfig({
  test: {
    include: ["src/**/*.test.ts"],
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.toml", environment: "dev" },
        miniflare: {
          bindings: {
            ANTHROPIC_API_KEY: "sk-test",
            APP_API_TOKEN: "test-token",
            TURNSTILE_SECRET: "test-secret",
          },
        },
      },
    },
  },
});
