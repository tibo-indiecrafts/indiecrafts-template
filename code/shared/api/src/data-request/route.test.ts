import { SELF, env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { Env } from "../index";
import { handleDataRequestWrite } from "./route";

function postDataRequest(body: Record<string, unknown>, bearer?: string) {
  return SELF.fetch("https://example.com/v1/data-request", {
    method: "POST",
    headers: {
      ...(bearer ? { authorization: `Bearer ${bearer}` } : {}),
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function getDataRequests(query = "", bearer?: string) {
  return SELF.fetch(`https://example.com/v1/data-requests${query}`, {
    headers: bearer ? { authorization: `Bearer ${bearer}` } : {},
  });
}

describe("POST /v1/data-request", () => {
  it("inserts a row and returns 201 with a valid bearer + body", async () => {
    const res = await postDataRequest(
      {
        requestType: "access",
        email: "subject@example.com",
        message: "Please send my data.",
        source: "/en/data-request",
        language: "en",
        policyVersion: "2026-01-01",
      },
      "test-token",
    );
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true });

    const row = await env.DB.prepare(
      "SELECT request_type, email, message, status, source, locale, policy_version FROM data_requests WHERE email = ?",
    )
      .bind("subject@example.com")
      .first<{
        request_type: string;
        email: string;
        message: string;
        status: string;
        source: string;
        locale: string;
        policy_version: string;
      }>();
    expect(row?.request_type).toBe("access");
    expect(row?.email).toBe("subject@example.com");
    expect(row?.message).toBe("Please send my data.");
    expect(row?.status).toBe("new");
    expect(row?.source).toBe("/en/data-request");
    expect(row?.locale).toBe("en");
    expect(row?.policy_version).toBe("2026-01-01");
  });

  it("401s with no bearer", async () => {
    const res = await postDataRequest({
      requestType: "access",
      email: "nobearer@example.com",
    });
    expect(res.status).toBe(401);
  });

  it("401s with a wrong bearer", async () => {
    const res = await postDataRequest(
      { requestType: "access", email: "wrongbearer@example.com" },
      "wrong-token",
    );
    expect(res.status).toBe(401);
  });

  it("400s an off-list requestType", async () => {
    const res = await postDataRequest(
      { requestType: "not-a-real-right", email: "offlist@example.com" },
      "test-token",
    );
    expect(res.status).toBe(400);
  });

  it("400s an empty email", async () => {
    const res = await postDataRequest(
      { requestType: "access", email: "" },
      "test-token",
    );
    expect(res.status).toBe(400);
  });

  it("503s when CORE_DB is unbound", async () => {
    const noDbEnv = { ...(env as unknown as Env), CORE_DB: undefined };
    const res = await handleDataRequestWrite(
      new Request("https://example.com/v1/data-request", {
        method: "POST",
        headers: {
          authorization: "Bearer test-token",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          requestType: "access",
          email: "nodb@example.com",
        }),
      }),
      noDbEnv,
    );
    expect(res.status).toBe(503);
  });
});

describe("GET /v1/data-requests", () => {
  it("401s with no bearer", async () => {
    const res = await getDataRequests();
    expect(res.status).toBe(401);
  });

  it("returns rows newest-first with a valid bearer, clamping limit", async () => {
    await env.DB.prepare(
      "INSERT INTO data_requests (request_type, email, message, status, submitted_at) VALUES (?, ?, ?, 'new', ?)",
    )
      .bind(
        "erasure",
        "older@example.com",
        "old one",
        "2020-01-01T00:00:00.000Z",
      )
      .run();
    await env.DB.prepare(
      "INSERT INTO data_requests (request_type, email, message, status, submitted_at) VALUES (?, ?, ?, 'new', ?)",
    )
      .bind(
        "erasure",
        "newer@example.com",
        "new one",
        "2030-01-01T00:00:00.000Z",
      )
      .run();

    const res = await getDataRequests("?limit=1", "test-token");
    expect(res.status).toBe(200);
    const { data } = (await res.json()) as {
      data: Array<{
        email: string;
        message: string;
        status: string;
        request_type: string;
      }>;
    };
    expect(data.length).toBe(1);
    expect(data[0].email).toBe("newer@example.com");
    expect(data[0].message).toBe("new one");
    expect(data[0].status).toBe("new");
    expect(data[0].request_type).toBe("erasure");
  });
});
