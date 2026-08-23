/// <reference types="@cloudflare/vitest-pool-workers" />
import {
  createExecutionContext,
  env,
  SELF,
  waitOnExecutionContext,
} from "cloudflare:test";
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

describe("retention purges", () => {
  const NOW = Date.UTC(2026, 0, 31); // 2026-01-31T00:00:00Z

  async function seedCspReport(
    groupKey: string,
    lastSeen: string,
  ): Promise<void> {
    const firstSeen = new Date(NOW - 60 * 86_400_000).toISOString();
    await env.DB?.prepare(
      "INSERT INTO csp_reports (group_key, first_seen, last_seen, surface, disposition, directive, document_path, blocked_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(groupKey, firstSeen, lastSeen, "website", "report", "img-src", "/", "https://example.com")
      .run();
  }

  async function runScheduled(scheduledTime: number): Promise<void> {
    const ctx = createExecutionContext();
    const controller = {
      cron: "0 6 * * *",
      scheduledTime,
      noRetry() {},
    } as unknown as ScheduledController;
    await worker.scheduled(controller, env, ctx);
    await waitOnExecutionContext(ctx);
  }

  it("purges csp_reports older than 30 days on last_seen", async () => {
    const old = new Date(NOW - 31 * 86_400_000).toISOString();
    const fresh = new Date(NOW - 1 * 86_400_000).toISOString();

    await seedCspReport("website|report|img-src|/a|https://x", old);
    await seedCspReport("website|report|img-src|/b|https://y", fresh);

    await runScheduled(NOW);

    const result = await env.DB!.prepare(
      "SELECT group_key FROM csp_reports ORDER BY group_key",
    ).all<{ group_key: string }>();

    const groupKeys = result.results.map((r) => r.group_key);
    expect(groupKeys).toEqual(["website|report|img-src|/b|https://y"]);
  });
});

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {}
}
