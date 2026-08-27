// Store-agnostic erasure + pseudonymisation orchestrator. Pure TS: it takes an
// array of ErasureAdapter (one per store) and runs them, so no single runtime
// needs every store's secret. The concrete adapters (D1, Clerk, Sanity, orders)
// live where their store lives and are passed in by the caller.
//
// "erase" runs anonymize() THEN delete() on each adapter; "anonymize" runs only
// anonymize() (the standalone pseudonymisation used by the admin console + the
// retention cron). dryRun runs preview() and mutates nothing. The receipt
// enumerates EVERY adapter, so a store can never be silently skipped (spec §21).
// ts + fingerprint are injected so this stays deterministic and clock-free.

export interface ErasureAdapter {
  readonly name: string;
  findByEmail(email: string): Promise<AdapterMatch>;
  export(email: string): Promise<unknown>;
  preview(email: string): Promise<AdapterPreview>;
  anonymize(email: string): Promise<AdapterResult>;
  delete(email: string): Promise<AdapterResult>;
}

export interface AdapterMatch {
  readonly found: boolean;
  readonly detail?: Record<string, number>;
}
export interface AdapterPreview {
  readonly store: string;
  readonly wouldAnonymize: Record<string, number>;
  readonly wouldDelete: Record<string, number>;
  // Set by a registered no-op adapter (e.g. no commerce store yet). A receipt
  // must not read an empty result as a completed erasure.
  readonly notApplicable?: true;
}
export interface AdapterResult {
  readonly store: string;
  readonly anonymized: Record<string, number>;
  readonly deleted: Record<string, number>;
  // Set by a registered no-op adapter (e.g. no commerce store yet). A receipt
  // must not read an empty result as a completed erasure.
  readonly notApplicable?: true;
}

export type ErasureMode = "erase" | "anonymize";

export interface ErasureReceipt {
  readonly email_fingerprint: string | null;
  readonly mode: ErasureMode;
  readonly dryRun: boolean;
  readonly ts: string;
  readonly stores: Array<AdapterResult | AdapterPreview>;
  readonly errors: Array<{ store: string; error: string }>;
}

export interface ExportBundle {
  readonly ts: string;
  readonly stores: Record<string, unknown>;
}

export async function runErasure(
  adapters: ErasureAdapter[],
  email: string,
  opts: {
    mode: ErasureMode;
    dryRun: boolean;
    ts: string;
    fingerprint?: string | null;
  },
): Promise<ErasureReceipt> {
  const stores: Array<AdapterResult | AdapterPreview> = [];
  const errors: Array<{ store: string; error: string }> = [];
  for (const adapter of adapters) {
    try {
      if (opts.dryRun) {
        stores.push(await adapter.preview(email));
        continue;
      }
      const anonymized = await adapter.anonymize(email);
      const deleted =
        opts.mode === "erase"
          ? await adapter.delete(email)
          : { store: adapter.name, anonymized: {}, deleted: {} };
      stores.push({
        store: adapter.name,
        anonymized: anonymized.anonymized,
        deleted: deleted.deleted,
        // Carry a no-op adapter's not-applicable marker into the receipt (the
        // dry-run path pushes the preview verbatim, so it is already carried there).
        ...(anonymized.notApplicable ? { notApplicable: anonymized.notApplicable } : {}),
      });
    } catch (error) {
      errors.push({
        store: adapter.name,
        error: error instanceof Error ? error.name : "unknown",
      });
    }
  }
  return {
    email_fingerprint: opts.fingerprint ?? null,
    mode: opts.mode,
    dryRun: opts.dryRun,
    ts: opts.ts,
    stores,
    errors,
  };
}

export async function runExport(
  adapters: ErasureAdapter[],
  email: string,
): Promise<ExportBundle> {
  const stores: Record<string, unknown> = {};
  for (const adapter of adapters) {
    stores[adapter.name] = await adapter.export(email);
  }
  return { ts: "", stores };
}
