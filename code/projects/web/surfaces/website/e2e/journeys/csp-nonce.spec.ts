import { expect, test } from "@playwright/test";

/**
 * SP3 CSP nonce enforcement — `src/proxy.ts` stamps a per-request nonce on the
 * CSP header it sets. The server now defaults to `CSP_MODE=enforce`, so the
 * strict, nonce-gated policy IS the enforced `content-security-policy`; this
 * suite proves that policy actually works — the nonce lands on the served
 * script and nothing gets blocked. See `code/docs/projects/web/website/seo/security-headers.md`.
 * `/studio` is excluded from the proxy matcher and keeps the static, permissive
 * `studioCspRule` (Sanity Studio needs `'unsafe-inline'` and can't take a nonce).
 */

const NONCE_RE = /'nonce-([A-Za-z0-9+/=]+)'/;

test("home page: strict nonce CSP is enforced, matching script nonce, no CSP violations", async ({
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

  // The strict nonce policy is the enforced header in enforce mode.
  const csp = headers["content-security-policy"] ?? "";
  expect(csp).toContain("'strict-dynamic'");
  const match = csp.match(NONCE_RE);
  expect(match).not.toBeNull();
  const nonce = match![1];

  // No separate Report-Only header — enforce mode ships enforced-only.
  expect(headers["content-security-policy-report-only"]).toBeUndefined();

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
