/// <reference types="@cloudflare/vitest-pool-workers" />
import { createExecutionContext, env, SELF, waitOnExecutionContext } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker, { type Env } from "./index";

// `SELF` runs the actual worker in workerd; `scheduled` is invoked directly with the
// real `env` + an execution context. The job logic lives in a brick — unit-test it there.
describe("cron worker (workerd)", () => {
  it("serves a health fetch", async () => {
    const res = await SELF.fetch("https://example.com/");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("runs a scheduled tick without throwing", async () => {
    const ctx = createExecutionContext();
    const controller = {
      cron: "0 6 * * *",
      scheduledTime: 0,
      noRetry() {},
    } as unknown as ScheduledController;
    await worker.scheduled(controller, env, ctx);
    await waitOnExecutionContext(ctx);
  });
});

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {}
}
