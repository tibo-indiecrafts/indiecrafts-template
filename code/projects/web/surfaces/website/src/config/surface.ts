/**
 * This surface's audit / telemetry origin id — the one home for "which surface am I".
 * Consent + session logs tag their source with this, so the audit trail stays correct
 * as surfaces multiply. A second surface (admin, app) ships its own value here.
 */
export const surface = "website";
