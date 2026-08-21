export { sendEmail } from "./resend";
export type { SendEmailInput } from "./resend";

export { renderEmailLayout, escapeHtml } from "./layout";
export type { EmailLayoutInput, RenderedEmail } from "./layout";

// The token-derived email palette (resolved hex). Templates import it so every
// email tracks the design system — no hand-maintained per-template hex.
export { EMAIL_COLORS } from "./theme";

// Templates live with the feature that owns them (blog · newsletter · waitlist ·
// compliance), each importing `renderEmailLayout`/`escapeHtml`/`RenderedEmail`
// from here. This brick owns only the shared email SYSTEM — send + layout + the
// render contract + the Sanity group factories — and names no feature.
