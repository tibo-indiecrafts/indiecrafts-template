import { SELF, env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { Env } from "../index";
import { handleDataRequestWrite, handleDataRequestList } from "./route";

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
    expect(await res.json()).toEqual({ ok: true, id: expect.any(Number) });

    const row = await env.AUDIT_DB.prepare(
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

  it("503s when MAIN_DB is unbound", async () => {
    const noDbEnv = { ...(env as unknown as Env), MAIN_DB: undefined };
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

describe("POST /v1/data-request — submittedAt", () => {
  it("stores now when submittedAt is not a date, so the list never breaks", async () => {
    const res = await postDataRequest(
      {
        requestType: "access",
        email: "bad-date@example.com",
        submittedAt: "garbage",
      },
      "test-token",
    );
    expect(res.status).toBe(201);
    const row = await env.AUDIT_DB.prepare(
      "SELECT submitted_at FROM data_requests WHERE email = ?",
    )
      .bind("bad-date@example.com")
      .first<{ submitted_at: string }>();
    expect(Number.isNaN(Date.parse(row!.submitted_at))).toBe(false);
  });
});

describe("GET /v1/data-requests", () => {
  it("401s with no bearer", async () => {
    const res = await getDataRequests();
    expect(res.status).toBe(401);
  });

  it("returns rows newest-first with a valid bearer, clamping limit", async () => {
    await env.AUDIT_DB.prepare(
      "INSERT INTO data_requests (request_type, email, message, status, submitted_at) VALUES (?, ?, ?, 'new', ?)",
    )
      .bind(
        "erasure",
        "older@example.com",
        "old one",
        "2020-01-01T00:00:00.000Z",
      )
      .run();
    await env.AUDIT_DB.prepare(
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
        due_at: string;
      }>;
    };
    expect(data.length).toBe(1);
    expect(data[0].due_at).toBe("2030-02-01T00:00:00.000Z");
    expect(data[0].email).toBe("newer@example.com");
    expect(data[0].message).toBe("new one");
    expect(data[0].status).toBe("new");
    expect(data[0].request_type).toBe("erasure");
  });
});

describe("data_requests at-rest encryption (PII_ENCRYPTION_KEY)", () => {
  // A keyed env, without mutating the global test env (whose other tests use the
  // plaintext path). Mirrors the "503 when MAIN_DB unbound" pattern above.
  const keyedEnv = () =>
    ({ ...(env as unknown as Env), PII_ENCRYPTION_KEY: "test-pii-key" }) as Env;
  const writeReq = (body: Record<string, unknown>) =>
    new Request("https://example.com/v1/data-request", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  const list = (e: Env) =>
    handleDataRequestList(
      new Request("https://example.com/v1/data-requests?limit=200", {
        headers: { authorization: "Bearer test-token" },
      }),
      e,
    );

  it("stores ciphertext at rest, but the keyed list read round-trips the plaintext", async () => {
    const e = keyedEnv();
    const w = await handleDataRequestWrite(
      writeReq({
        requestType: "portability",
        email: "enc@example.com",
        message: "secret note",
      }),
      e,
    );
    expect(w.status).toBe(201);

    // The raw column is NOT the plaintext — it's the AES-256-GCM envelope JSON.
    const raw = await env.MAIN_DB.prepare(
      "SELECT email, message FROM data_requests WHERE request_type = 'portability' ORDER BY id DESC LIMIT 1",
    ).first<{ email: string; message: string }>();
    expect(raw?.email).not.toBe("enc@example.com");
    const envelope = JSON.parse(raw!.email) as {
      version: number;
      ciphertext: string;
      iv: string;
    };
    expect(envelope.version).toBe(1);
    expect(typeof envelope.ciphertext).toBe("string");
    expect(typeof envelope.iv).toBe("string");

    // The keyed operator read decrypts it back to plaintext.
    const { data } = (await (await list(e)).json()) as {
      data: Array<{ email: string; message: string; request_type: string }>;
    };
    const row = data.find((d) => d.request_type === "portability");
    expect(row?.email).toBe("enc@example.com");
    expect(row?.message).toBe("secret note");
  });

  it("still reads legacy plaintext rows when a key is configured", async () => {
    // A row written WITHOUT encryption (pre-key), read back WITH a key → returned as-is.
    await env.MAIN_DB.prepare(
      "INSERT INTO data_requests (request_type, email, message, status, submitted_at) VALUES ('objection', 'legacy@example.com', 'plain msg', 'new', '2031-01-01T00:00:00.000Z')",
    ).run();
    const { data } = (await (await list(keyedEnv())).json()) as {
      data: Array<{ email: string; message: string; request_type: string }>;
    };
    const row = data.find((d) => d.request_type === "objection");
    expect(row?.email).toBe("legacy@example.com");
    expect(row?.message).toBe("plain msg");
  });
});
