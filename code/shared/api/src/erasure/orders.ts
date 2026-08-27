import type { ErasureAdapter } from "@indiecrafts/packages-shared-compliance/shared";

// Future commerce seam. Orders/invoices carry a 7–10y anonymised retention duty
// (spec §4); the real adapter lands with the product D1 + checkout. Until then it
// is a registered no-op. It reports `notApplicable` so the engine + receipt
// enumerate "orders" WITHOUT claiming an erasure ran on a store that does not exist.
export function createOrdersErasureAdapter(): ErasureAdapter {
  return {
    name: "orders",
    async findByEmail() {
      return { found: false };
    },
    async export() {
      return null;
    },
    async preview() {
      return { store: "orders", wouldAnonymize: {}, wouldDelete: {}, notApplicable: true };
    },
    async anonymize() {
      return { store: "orders", anonymized: {}, deleted: {}, notApplicable: true };
    },
    async delete() {
      return { store: "orders", anonymized: {}, deleted: {}, notApplicable: true };
    },
  };
}
