/**
 * Re-export the security-events taxonomy, thresholds, counter, and alerts.
 *
 * @see docs/reference/packages/shared/security-events/src/index.md
 */
export {
  type SecurityEventType,
  type Severity,
  type SecurityEvent,
} from "./events";
export { classifyFailedLogins, FAILED_LOGIN } from "./thresholds";
export { type KvLike, bumpCounter } from "./kv-counter";
export {
  ALERT_SEVERITIES,
  shouldAlert,
  formatSecurityAlert,
  type SecurityAlert,
  type SecurityAlertCopy,
} from "./alerts";
