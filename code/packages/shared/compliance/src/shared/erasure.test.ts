import { describe, expect, it, vi } from "vitest";
import { runErasure, runExport, type ErasureAdapter } from "./erasure";

function fakeAdapter(name: string): ErasureAdapter {
  return {
    name,
    findByEmail: vi.fn(async () => ({ found: true, detail: { rows: 1 } })),
    export: vi.fn(async () => ({ [name]: "data" })),
    preview: vi.fn(async () => ({
      store: name,
      wouldAnonymize: { profile: 1 },
      wouldDelete: { events: 2 },
    })),
    anonymize: vi.fn(async () => ({
      store: name,
      anonymized: { profile: 1 },
      deleted: {},
    })),
    delete: vi.fn(async () => ({
      store: name,
      anonymized: {},
      deleted: { events: 2 },
    })),
  };
}

describe("runErasure", () => {
  const OPTS = { ts: "2026-01-01T00:00:00.000Z", fingerprint: "fp1" };

  it("erase mode calls anonymize AND delete on every adapter; receipt enumerates all", async () => {
    const a = fakeAdapter("clerk");
    const b = fakeAdapter("d1");
    const r = await runErasure([a, b], "x@y.com", {
      mode: "erase",
      dryRun: false,
      ...OPTS,
    });
    expect(a.anonymize).toHaveBeenCalledOnce();
    expect(a.delete).toHaveBeenCalledOnce();
    expect(r.stores.map((s) => s.store).sort()).toEqual(["clerk", "d1"]);
    expect(r.mode).toBe("erase");
    expect(r.email_fingerprint).toBe("fp1");
    expect(r.errors).toEqual([]);
  });

  it("anonymize mode calls anonymize but NOT delete", async () => {
    const a = fakeAdapter("d1");
    await runErasure([a], "x@y.com", {
      mode: "anonymize",
      dryRun: false,
      ...OPTS,
    });
    expect(a.anonymize).toHaveBeenCalledOnce();
    expect(a.delete).not.toHaveBeenCalled();
  });

  it("dryRun calls preview only — never anonymize/delete", async () => {
    const a = fakeAdapter("d1");
    const r = await runErasure([a], "x@y.com", {
      mode: "erase",
      dryRun: true,
      ...OPTS,
    });
    expect(a.preview).toHaveBeenCalledOnce();
    expect(a.anonymize).not.toHaveBeenCalled();
    expect(a.delete).not.toHaveBeenCalled();
    expect(r.dryRun).toBe(true);
  });

  it("captures a failing adapter without aborting the others", async () => {
    const ok = fakeAdapter("d1");
    const bad = fakeAdapter("sanity");
    (bad.anonymize as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("boom"),
    );
    const r = await runErasure([ok, bad], "x@y.com", {
      mode: "erase",
      dryRun: false,
      ...OPTS,
    });
    expect(ok.anonymize).toHaveBeenCalledOnce(); // sibling still ran
    expect(r.errors).toEqual([{ store: "sanity", error: "Error" }]);
  });

  it("carries a no-op adapter's notApplicable into the receipt (live + dryRun)", async () => {
    const noop: ErasureAdapter = {
      name: "orders",
      findByEmail: vi.fn(async () => ({ found: false })),
      export: vi.fn(async () => null),
      preview: vi.fn(async () => ({
        store: "orders",
        wouldAnonymize: {},
        wouldDelete: {},
        notApplicable: true as const,
      })),
      anonymize: vi.fn(async () => ({
        store: "orders",
        anonymized: {},
        deleted: {},
        notApplicable: true as const,
      })),
      delete: vi.fn(async () => ({
        store: "orders",
        anonymized: {},
        deleted: {},
        notApplicable: true as const,
      })),
    };
    const live = await runErasure([noop], "x@y.com", {
      mode: "erase",
      dryRun: false,
      ...OPTS,
    });
    expect(live.stores[0].notApplicable).toBe(true);
    const dry = await runErasure([noop], "x@y.com", {
      mode: "erase",
      dryRun: true,
      ...OPTS,
    });
    expect(dry.stores[0].notApplicable).toBe(true);
  });
});

describe("runExport", () => {
  it("gathers export() from every adapter — no silent miss", async () => {
    const a = fakeAdapter("clerk");
    const b = fakeAdapter("d1");
    const bundle = await runExport([a, b], "x@y.com");
    expect(Object.keys(bundle.stores).sort()).toEqual(["clerk", "d1"]);
    expect(a.export).toHaveBeenCalledOnce();
    expect(b.export).toHaveBeenCalledOnce();
  });
});
