/**
 * Fetch a Clerk Testing Token before the admin e2e run when auth keys are set.
 *
 * @see docs/reference/projects/web/admin/e2e/global-setup.md
 */
import { clerkSetup } from "@clerk/testing/playwright";

/** No content to seed — the only setup is a Clerk Testing Token when the keys are wired. */
export default async function globalSetup() {
  if (process.env.CLERK_SECRET_KEY) await clerkSetup();
}
