/**
 * Re-export the erasure adapter factories and client interfaces.
 *
 * @see docs/reference/shared/api/src/erasure/index.md
 */
export {
  createCoreErasureAdapter,
  createAuditErasureAdapter,
  resolveSubject,
} from "./d1";
export { createClerkErasureAdapter, type ClerkErasureClient } from "./clerk";
export { createSanityErasureAdapter, type SanityErasureClient } from "./sanity";
export { createOrdersErasureAdapter } from "./orders";
