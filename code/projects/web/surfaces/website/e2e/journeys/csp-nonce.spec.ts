import { expect, test } from "@playwright/test";

/**
 * SP3 CSP nonce enforcement — `src/proxy.ts` stamps a per-request nonce on both
 * CSP headers it sets. This spec runs under the default `CSP_MODE=report-only`
 * (nothing in CI/playwright flips it to `enforce`, and this suite deliberately
 * doesn't either — that would force every website e2e journey into enforce
 * mode): the permissive policy stays the enforced `content-security-policy`,
 * and the strict, nonce-gated policy ships as `content-security-policy-report-only`
 * — so that's the header this spec validates the nonce against. See
 * `code/docs/apps/web/seo/security-headers.md`. `/studio` is excluded from the
 * proxy matcher and keeps the static, permissive `studioCspRule` (Sanity
 * Studio needs `'unsafe-inline'` and can't take a nonce).
 */

const NONCE_RE = /'nonce-([A-Za-z0-9+/=]+)'/;

test("home page: strict nonce CSP is Report-Only, matching script nonce, no CSP violations", async ({
  page,
}) => {
  // Collect violations two ways: the DOM event (fires even where the console
  // message format is engine-specific) and console errors mentioning CSP.
  await page.addInitScript(() => {
    (window as unknown as { __cspViolations: string[] }).__cspViolations = [];
    document.addEventListener("securitypolicyviolation", (e) => {
      (window as unknown as { __cspViolations: string[] }).__cspViolations.push(
        `${e.violatedDirective}: ${e.blockedURI}`,
      );
    });
  });
  const consoleViolations: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" && /content security policy/i.test(msg.text())) {
      consoleViolations.push(msg.text());
    }
  });

  const res = await page.goto("/en");
  const headers = res?.headers() ?? {};

  // The enforced header is the permissive policy in report-only mode — no
  // strict-dynamic, so the two-header split is real (nothing enforced changed).
  expect(headers["content-security-policy"] ?? "").not.toContain("'strict-dynamic'");

  // The strict nonce policy ships as Report-Only — this is what's being proven.
  const reportOnlyCsp = headers["content-security-policy-report-only"] ?? "";
  expect(reportOnlyCsp).toContain("'strict-dynamic'");
  const match = reportOnlyCsp.match(NONCE_RE);
  expect(match).not.toBeNull();
  const nonce = match![1];

  // Assert against the served HTML (response body), not the live DOM — browsers
  // strip the `nonce` attribute from the DOM/CSS-selector surface after using it
  // (anti-sniffing), so `page.locator('script[nonce=...]')` would never match.
  const html = await res!.text();
  expect(html).toContain(`nonce="${nonce}"`);

  await page.waitForLoadState("networkidle");
  const domViolations = await page.evaluate(
    () => (window as unknown as { __cspViolations: string[] }).__cspViolations,
  );
  expect(domViolations).toEqual([]);
  expect(consoleViolations).toEqual([]);
});

test("/studio: permissive static CSP, no strict-dynamic", async ({ request }) => {
  const res = await request.get("/studio");
  const csp = res.headers()["content-security-policy"] ?? "";
  expect(csp).toContain("'unsafe-inline'");
  expect(csp).not.toContain("'strict-dynamic'");
});
