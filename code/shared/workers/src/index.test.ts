/// <reference types="@cloudflare/vitest-pool-workers" />
import {
  createExecutionContext,
  env,
  SELF,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker, { type Env } from "./index";

// `SELF` runs the actual worker in workerd (with the env echo from wrangler.toml);
// `scheduled` is invoked directly with the real `env`. A real job gets its own tests here, or in
// its brick once another unit shares it.
describe("background worker (workerd)", () => {
  it("serves /health with the env echo", async () => {
    const res = await SELF.fetch("https://example.com/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, env: "unknown" });
  });

  it("404s an unknown path", async () => {
    const res = await SELF.fetch("https://example.com/nope");
    expect(res.status).toBe(404);
  });

  it("runs a scheduled tick without throwing", async () => {
    const ctx = createExecutionContext();
    const event = {
      cron: "0 6 * * *",
      scheduledTime: 0,
      noRetry() {},
    } as unknown as ScheduledController;
    await worker.scheduled(event, env, ctx);
    await waitOnExecutionContext(ctx);
  });
});

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {}
}
