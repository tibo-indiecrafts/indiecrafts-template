import { env, SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

async function postCspReports(reports: unknown[]) {
  return SELF.fetch("https://example.com/v1/events", {
    method: "POST",
    headers: {
      authorization: "Bearer test-token",
      "content-type": "application/json",
    },
    body: JSON.stringify({ kind: "csp-report", reports }),
  });
}

describe("kind:csp-report → csp_reports", () => {
  it("upserts an aggregated row and increments count", async () => {
    const one = {
      surface: "website",
      disposition: "report",
      directive: "img-src",
      documentPath: "/orders/:id",
      blockedSource: "https://evil.example",
      sampleSourceFile: "https://x.dev/p",
      sampleLine: 4,
      sampleSnippet: "x",
    };

    expect((await postCspReports([one])).status).toBe(201);
    expect((await postCspReports([one])).status).toBe(201);

    const row = await env.DB.prepare(
      "SELECT count, document_path FROM csp_reports WHERE group_key = ?",
    )
      .bind("website|report|img-src|/orders/:id|https://evil.example")
      .first<{ count: number; document_path: string }>();
    expect(row?.count).toBe(2);
    expect(row?.document_path).toBe("/orders/:id");
  });

  it("with an empty array is 400", async () => {
    const res = await postCspReports([]);
    expect(res.status).toBe(400);
  });
});
