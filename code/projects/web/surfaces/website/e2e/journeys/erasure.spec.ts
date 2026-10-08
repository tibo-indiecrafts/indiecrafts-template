import { expect, test, type Page, type Route } from "@playwright/test";
import en from "../../messages/en.json";

const request = en.legal.erasure.request;
const confirm = en.legal.erasure.confirm;

/**
 * Anonymous GDPR erasure, client side. Both forms post straight to the shared api
 * (`NEXT_PUBLIC_API_URL` + `/v1/erasure/{request,confirm}`); those calls are stubbed,
 * so nothing is erased and no email leaves. The worker's own rules are tested in
 * `code/shared/api`. These prove the forms: the email gate, the status each api answer
 * maps to, and that the emailed token travels only in the POST body.
 *
 * SKIPS when the build has no `NEXT_PUBLIC_API_URL`: both pages 404 by design then.
 */
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type",
  "access-control-allow-methods": "POST",
};

/** Stub one worker route (cross-origin, so answer the preflight too); record each POST body. */
async function stubApi(page: Page, path: string, status: number) {
  const posts: string[] = [];
  await page.route(`**${path}`, async (route: Route) => {
    if (route.request().method() === "OPTIONS")
      return route.fulfill({ status: 204, headers: CORS });
    posts.push(route.request().postData() ?? "");
    return route.fulfill({ status, headers: CORS, body: "{}" });
  });
  return posts;
}

async function open(page: Page, url: string) {
  const res = await page.goto(url);
  test.skip(res?.status() === 404, "no NEXT_PUBLIC_API_URL in this build — page is off");
}

test.describe("/erasure — request a link", () => {
  const cases = [
    { status: 200, text: request.sent },
    { status: 403, text: request.turnstile },
    { status: 500, text: request.error },
  ];
  for (const { status, text } of cases) {
    test(`an api ${status} shows “${text}”`, async ({ page }) => {
      const posts = await stubApi(page, "/v1/erasure/request", status);
      await open(page, "/erasure");
      await expect(page.getByRole("heading", { name: request.heading })).toBeVisible();

      const submit = page.getByRole("button", { name: request.submitButton });
      await expect(submit).toBeDisabled(); // email gate
      await page.getByLabel(request.emailLabel).fill("e2e@example.com");
      await submit.click();

      await expect(page.getByRole("status").filter({ hasText: text })).toBeVisible();
      expect(posts).toHaveLength(1);
      expect(posts[0]).toContain("e2e@example.com");
    });
  }
});

test.describe("/erasure/confirm — confirm with the emailed token", () => {
  const cases = [
    { status: 200, text: confirm.success },
    { status: 207, text: confirm.partial },
    { status: 400, text: confirm.mismatch },
    { status: 429, text: confirm.expired },
    { status: 500, text: confirm.error },
  ];
  for (const { status, text } of cases) {
    test(`an api ${status} shows “${text}”`, async ({ page }) => {
      const posts = await stubApi(page, "/v1/erasure/confirm", status);
      await open(page, "/erasure/confirm?token=tok-e2e-123");
      await expect(page.getByRole("heading", { name: confirm.heading })).toBeVisible();
      expect(posts).toHaveLength(0); // opening the link erases nothing
      await expect(page.locator("body")).not.toContainText("tok-e2e-123"); // never rendered

      const submit = page.getByRole("button", { name: confirm.submitButton });
      await expect(submit).toBeDisabled(); // email gate
      await page.getByLabel(confirm.emailLabel).fill("e2e@example.com");
      await submit.click();

      await expect(page.getByRole("status").filter({ hasText: text })).toBeVisible();
      expect(posts.map((p) => JSON.parse(p) as unknown)).toEqual([
        { token: "tok-e2e-123", email: "e2e@example.com" },
      ]);
    });
  }
});
