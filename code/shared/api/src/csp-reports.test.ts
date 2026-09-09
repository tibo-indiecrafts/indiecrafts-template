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

    const row = await env.AUDIT_DB.prepare(
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

describe("GET /v1/csp-reports", () => {
  it("returns seeded rows ordered by count DESC, last_seen DESC", async () => {
    await postCspReports([
      {
        surface: "website",
        disposition: "report",
        directive: "img-src",
        documentPath: "/a",
        blockedSource: "https://low.example",
        sampleSourceFile: "https://x.dev/p",
        sampleLine: 1,
        sampleSnippet: "a",
      },
    ]);
    const high = {
      surface: "website",
      disposition: "enforce",
      directive: "script-src-elem",
      documentPath: "/b",
      blockedSource: "https://high.example",
      sampleSourceFile: "https://x.dev/p",
      sampleLine: 2,
      sampleSnippet: "b",
    };
    await postCspReports([high]);
    await postCspReports([high]);

    const res = await SELF.fetch("https://example.com/v1/csp-reports", {
      headers: { authorization: "Bearer test-token" },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      data: { group_key: string; count: number }[];
    };
    const groups = body.data.map((row) => row.group_key);
    expect(groups[0]).toBe(
      "website|enforce|script-src-elem|/b|https://high.example",
    );
    expect(body.data[0].count).toBe(2);
    expect(groups).toContain("website|report|img-src|/a|https://low.example");
  });
});
