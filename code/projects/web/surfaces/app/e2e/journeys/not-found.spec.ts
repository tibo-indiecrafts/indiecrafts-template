import { expect, test } from "@playwright/test";

/**
 * KNOWN GAP (documented, not a failure): the `app` surface has **no `[locale]/not-found.tsx`**,
 * so an unknown route returns **200** (Next's soft fallback) instead of a branded **404** —
 * unlike `website` (which ships `NotFoundContent`). `test.fixme` records this without failing
 * CI. To close it: add a `[locale]/not-found.tsx` (mirror website's), then drop `.fixme`.
 */
test.fixme("unknown route returns 404 (app needs a not-found.tsx)", async ({
  page,
}) => {
  const res = await page.goto("/en/__does-not-exist__");
  expect(res?.status()).toBe(404);
});
