/**
 * Fetch a Clerk Testing Token before the app e2e run when auth keys are set.
 *
 * @see docs/reference/projects/web/app/e2e/global-setup.md
 */
import { clerkSetup } from "@clerk/testing/playwright";

/**
 * App e2e has no seeded-content dependency (the home welcome falls back to a message-file
 * string), so the only setup is a Clerk **Testing Token** when the auth keys are wired — a
 * no-op otherwise, so a run without Clerk keys is unaffected.
 */
export default async function globalSetup() {
  if (process.env.CLERK_SECRET_KEY) await clerkSetup();
}
