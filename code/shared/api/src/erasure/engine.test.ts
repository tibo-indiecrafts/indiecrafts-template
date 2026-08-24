import { env } from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import {
  runErasure,
  runExport,
} from "@indiecrafts/packages-shared-compliance/shared";
import { describe, expect, it, vi } from "vitest";
import { createD1ErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";

const SALT = "engine-salt";
const EMAIL = "full@x.com";
const USER = "user_full";

async function seedProfile() {
  const fp = await fingerprintEmail(EMAIL, SALT);
  await env.DB.prepare(
    "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind(USER, EMAIL, fp, new Date(0).toISOString())
    .run();
  return fp;
}

function adapters() {
  const clerk = createClerkErasureAdapter({
    findUserIdByEmail: vi.fn(async () => USER),
    exportUser: vi.fn(async () => ({ id: USER })),
    deleteUser: vi.fn(async () => {}),
  });
  const sanity = createSanityErasureAdapter(
    { findByEmail: vi.fn(async () => []), pseudonymise: vi.fn(async () => {}) },
    SALT,
  );
  return [
    createD1ErasureAdapter(env.DB, SALT),
    clerk,
    sanity,
    createOrdersErasureAdapter(),
  ];
}

describe("erasure engine (full run)", () => {
  it("erase visits every store; receipt + export enumerate all four", async () => {
    const fp = await seedProfile();
    const a = adapters();
    const receipt = await runErasure(a, EMAIL, {
      mode: "erase",
      dryRun: false,
      ts: "2026-01-01T00:00:00.000Z",
      fingerprint: fp,
    });
    expect(receipt.stores.map((s) => s.store).sort()).toEqual([
      "clerk",
      "d1",
      "orders",
      "sanity",
    ]);
    expect(receipt.errors).toEqual([]);
    // D1 actually pseudonymised the profile
    const prof = await env.DB.prepare(
      "SELECT anonymized FROM user_profiles WHERE user_id=?",
    )
      .bind(USER)
      .first<{ anonymized: number }>();
    expect(prof?.anonymized).toBe(1);

    const bundle = await runExport(a, EMAIL);
    expect(Object.keys(bundle.stores).sort()).toEqual([
      "clerk",
      "d1",
      "orders",
      "sanity",
    ]);
  });

  it("dryRun previews every store and mutates nothing", async () => {
    await seedProfile();
    const receipt = await runErasure(adapters(), EMAIL, {
      mode: "erase",
      dryRun: true,
      ts: "t",
      fingerprint: null,
    });
    expect(receipt.dryRun).toBe(true);
    const prof = await env.DB.prepare(
      "SELECT email FROM user_profiles WHERE user_id=?",
    )
      .bind(USER)
      .first<{ email: string }>();
    expect(prof?.email).toBe(EMAIL); // untouched
  });
});
