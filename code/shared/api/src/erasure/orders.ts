import type { ErasureAdapter } from "@indiecrafts/packages-shared-compliance/shared";

// Future commerce seam. Orders/invoices carry a 7–10y anonymised retention duty
// (spec §4); the real adapter lands with the product D1 + checkout. No orders
// store exists yet, so this is a registered no-op stub: every method returns
// empty `anonymized`/`deleted` (there is no `notApplicable` result type). It
// lets the engine + receipt already enumerate "orders" ahead of the real store.
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
      return { store: "orders", wouldAnonymize: {}, wouldDelete: {} };
    },
    async anonymize() {
      return { store: "orders", anonymized: {}, deleted: {} };
    },
    async delete() {
      return { store: "orders", anonymized: {}, deleted: {} };
    },
  };
}
