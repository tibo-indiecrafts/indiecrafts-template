import { env } from "cloudflare:test";
import {
  fingerprintEmail,
  sha256Hex,
} from "@indiecrafts/packages-shared-security/crypto";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import {
  createCoreErasureAdapter,
  createAuditErasureAdapter,
} from "../erasure/d1";
import { createClerkErasureAdapter } from "../erasure/clerk";
import { createSanityErasureAdapter } from "../erasure/sanity";
import { createOrdersErasureAdapter } from "../erasure/orders";
import { handleExport, handleExportDownload } from "./route";

const SALT = "test-fingerprint-salt";
const EMAIL = "export-subject@x.com";
const USER = "user_export_1";

function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    ...(env as unknown as Env),
    GDPR_FINGERPRINT_SALT: SALT,
    CLERK_SECRET_KEY: "sk_test",
    SANITY_API_WRITE_TOKEN: "sk_sanity",
    SANITY_PROJECT_ID: "pid",
    SANITY_DATASET: "production",
    ...overrides,
  };
}

function postExport(): Request {
  return new Request("https://example.com/v1/export", {
    method: "POST",
    headers: { authorization: "Bearer tkn" },
  });
}

function getDownload(token: string): Request {
  return new Request(
    `https://example.com/v1/export/download?token=${encodeURIComponent(token)}`,
    { method: "GET" },
  );
}

async function seedProfile(): Promise<string> {
  const fp = await fingerprintEmail(EMAIL, SALT);
  await env.DB.prepare(
    "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind(USER, EMAIL, fp, new Date(0).toISOString())
    .run();
  return fp;
}

/** Injected auth (no real Clerk) + injected adapters (real D1 + mocked Clerk/Sanity). */
function mocks(
  authResult: {
    userId: string;
    email: string;
    fvaMinutes: number | null;
  } | null = {
    userId: USER,
    email: EMAIL,
    fvaMinutes: null,
  },
) {
  const authenticate = vi.fn(async () => authResult);
  const clerkClient = {
    findUserIdByEmail: vi.fn(async () => USER),
    exportUser: vi.fn(async () => ({ id: USER })),
    deleteUser: vi.fn(async () => {}),
  };
  const sanityClient = {
    findByEmail: vi.fn(async () => []),
    pseudonymise: vi.fn(async () => {}),
  };
  const build = (e: Env) => [
    createCoreErasureAdapter(e.CORE_DB!, SALT),
    createAuditErasureAdapter(e.DB!, e.CORE_DB!, SALT),
    createClerkErasureAdapter(clerkClient),
    createSanityErasureAdapter(sanityClient, SALT),
    createOrdersErasureAdapter(),
  ];
  return { authenticate, build };
}

interface ExportRow {
  r2_key: string;
  token_hash: string;
  expires_at: string;
  downloaded_at: string | null;
}

async function exportRowFor(fp: string): Promise<ExportRow | null> {
  return env.DB.prepare(
    "SELECT r2_key, token_hash, expires_at, downloaded_at FROM export_requests WHERE email_fingerprint = ? ORDER BY id DESC LIMIT 1",
  )
    .bind(fp)
    .first<ExportRow>();
}

describe("handleExport", () => {
  it("runs the export, stores the bundle in R2, and returns a single-use download link", async () => {
    const fp = await seedProfile();
    const { authenticate, build } = mocks();
    const res = await handleExport(
      postExport(),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(200);
    const { downloadUrl } = (await res.json()) as { downloadUrl: string };
    const token = new URL(downloadUrl).searchParams.get("token");
    expect(token).toBeTruthy();

    const row = await exportRowFor(fp);
    expect(row).toBeTruthy();
    expect(row?.downloaded_at).toBeNull();
    expect(row?.token_hash).toBe(await sha256Hex(token!));

    const obj = await env.EXPORT_BUCKET!.get(row!.r2_key);
    expect(obj).not.toBeNull();
    const stored = JSON.parse(await obj!.text()) as {
      ts: string;
      stores: Record<string, unknown>;
    };
    expect(stored.ts).toBeTruthy();
    expect(stored.stores).toHaveProperty("d1-core");
    expect(stored.stores).toHaveProperty("d1-audit");

    const audit = await env.DB.prepare(
      "SELECT event FROM admin_audit WHERE target_user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ event: string }>();
    expect(audit?.event).toBe("export.self");
  });

  it("returns 401 when the JWT is missing or invalid", async () => {
    const { build } = mocks();
    const res = await handleExport(
      postExport(),
      testEnv(),
      undefined,
      build,
      vi.fn(async () => null),
    );
    expect(res.status).toBe(401);
  });

  it("returns 503 when CLERK_SECRET_KEY is unset", async () => {
    const { authenticate } = mocks();
    // No 4th arg → buildErasureAdapters; env missing CLERK_SECRET_KEY.
    const res = await handleExport(
      postExport(),
      testEnv({ CLERK_SECRET_KEY: undefined }),
      undefined,
      undefined,
      authenticate,
    );
    expect(res.status).toBe(503);
  });

  it("returns 503 when EXPORT_BUCKET is unset", async () => {
    const { authenticate, build } = mocks();
    const res = await handleExport(
      postExport(),
      testEnv({ EXPORT_BUCKET: undefined }),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(503);
  });
});

describe("handleExportDownload", () => {
  it("streams the bundle once, then 400s on a second attempt (single-use)", async () => {
    const fp = await seedProfile();
    const { authenticate, build } = mocks();
    const exportRes = await handleExport(
      postExport(),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    const { downloadUrl } = (await exportRes.json()) as { downloadUrl: string };
    const token = new URL(downloadUrl).searchParams.get("token")!;

    const res = await handleExportDownload(
      getDownload(token),
      testEnv(),
      token,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-disposition")).toBe(
      'attachment; filename="my-data-export.json"',
    );
    const body = (await res.json()) as { stores: Record<string, unknown> };
    expect(body.stores).toHaveProperty("d1-core");
    expect(body.stores).toHaveProperty("d1-audit");

    const row = await exportRowFor(fp);
    expect(row?.downloaded_at).not.toBeNull();

    const second = await handleExportDownload(
      getDownload(token),
      testEnv(),
      token,
    );
    expect(second.status).toBe(400);
  });

  it("returns 400 for an expired token", async () => {
    const fp = await fingerprintEmail(EMAIL, SALT);
    const token = "expired-token";
    const r2Key = "export/expired-test.json";
    await env.EXPORT_BUCKET!.put(
      r2Key,
      JSON.stringify({ ts: new Date().toISOString(), stores: {} }),
    );
    await env.DB.prepare(
      "INSERT INTO export_requests (token_hash, r2_key, user_id, email_fingerprint, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
      .bind(
        await sha256Hex(token),
        r2Key,
        USER,
        fp,
        new Date(0).toISOString(),
        new Date(0).toISOString(),
      )
      .run();

    const res = await handleExportDownload(
      getDownload(token),
      testEnv(),
      token,
    );
    expect(res.status).toBe(400);
  });

  it("returns 404 for an absent token", async () => {
    const res = await handleExportDownload(getDownload(""), testEnv(), "");
    expect(res.status).toBe(404);
  });

  it("returns 503 when EXPORT_BUCKET is unset", async () => {
    const res = await handleExportDownload(
      getDownload("x"),
      testEnv({ EXPORT_BUCKET: undefined }),
      "x",
    );
    expect(res.status).toBe(503);
  });
});
