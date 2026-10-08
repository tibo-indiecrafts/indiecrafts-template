import { expect, test } from "@playwright/test";
import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import messages from "../../messages/en.json";

/**
 * Signed-in `/account` → "Your data": export, then delete, end to end through the api
 * (`/v1/export`, `/v1/erasure/self`). Each run creates its own throwaway `+clerk_test`
 * user through the Clerk Backend API (a dev instance accepts the code `424242`), so no
 * real user is touched; the delete step removes it, and `afterAll` removes a leftover.
 *
 * SKIPS unless Clerk (publishable + secret key) AND the api origin are wired — the page
 * 404s without `NEXT_PUBLIC_API_URL`. Locally, run the api first (`pnpm dev` or the
 * shared-api `dev` script) with the same Clerk instance.
 */
const SECRET = process.env.CLERK_SECRET_KEY;
const wired =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(SECRET) &&
  Boolean(process.env.NEXT_PUBLIC_API_URL);
const EMAIL = `e2e-account-${Date.now()}+clerk_test@example.com`;
const t = messages.account;

/** One Clerk Backend API call (plain fetch, no extra dependency). */
function clerkApi(path: string, init: RequestInit = {}) {
  return fetch(`https://api.clerk.com/v1${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${SECRET}`,
      "content-type": "application/json",
    },
  });
}

async function findUserId(): Promise<string | null> {
  const res = await clerkApi(`/users?email_address=${encodeURIComponent(EMAIL)}`);
  const users = (await res.json()) as Array<{ id: string }>;
  return users[0]?.id ?? null;
}

test.describe("account data (signed in)", () => {
  test.skip(
    !wired,
    "needs the Clerk test keys and NEXT_PUBLIC_API_URL (with the api running)",
  );
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    const res = await clerkApi("/users", {
      method: "POST",
      body: JSON.stringify({ email_address: [EMAIL], skip_password_requirement: true }),
    });
    expect(res.status, "create the throwaway Clerk user").toBe(200);
  });

  test.afterAll(async () => {
    const id = await findUserId();
    if (id) await clerkApi(`/users/${id}`, { method: "DELETE" });
  });

  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/sign-in"); // the site loads Clerk only here (or once signed in)
    await clerk.signIn({
      page,
      signInParams: { strategy: "email_code", identifier: EMAIL },
    });
    await page.goto("/account#/data");
  });

  test("export answers a single-use link to a bundle of the user's own data", async ({
    page,
    request,
  }) => {
    // The page opens the link in a new tab; block that tab so the test spends the token.
    await page.context().route("**/v1/export/download**", (r) => r.abort());
    const exported = page.waitForResponse(
      (r) => r.url().endsWith("/v1/export") && r.request().method() === "POST",
    );
    await page.getByRole("button", { name: t.export.button }).click();
    const res = await exported;
    expect(res.status()).toBe(200);
    const { downloadUrl } = (await res.json()) as { downloadUrl: string };
    await expect(page.getByRole("status")).toHaveText(t.export.success);

    const bundle = await request.get(downloadUrl);
    expect(bundle.status()).toBe(200);
    expect(await bundle.text()).toContain(EMAIL);
    // Single-use: the same link never serves the bundle twice.
    expect((await request.get(downloadUrl)).status()).not.toBe(200);
  });

  test("delete refuses a mismatched email, then erases the account", async ({ page }) => {
    await page.getByText(t.delete.heading).click(); // unfold the <details>
    const email = page.getByLabel(t.delete.emailLabel);
    const confirm = page.getByRole("button", { name: t.delete.confirmButton });

    await email.fill("someone-else@example.com");
    await confirm.click();
    await expect(page.getByRole("status")).toHaveText(t.delete.mismatch);
    expect(await findUserId(), "a mismatch deletes nothing").not.toBeNull();

    await email.fill(EMAIL);
    await confirm.click();
    // A done erasure signs the user out and returns home (the erasure chain takes seconds).
    await expect(page).toHaveURL((u) => u.pathname === "/", { timeout: 15_000 });
    await expect.poll(findUserId, { message: "the Clerk user is gone" }).toBeNull();
  });
});
