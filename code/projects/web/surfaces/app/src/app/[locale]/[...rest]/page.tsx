/**
 * Send every unknown path to the localized 404.
 *
 * @see docs/reference/projects/web/app/src/app/locale/rest/page.md
 */
import { notFound } from "next/navigation";

/** Without it an unknown path falls through to the root not-found, outside `[locale]` —
 *  where the passthrough root layout has no <html>/<body> (a dev runtime error, Next's
 *  bare 404 in production). Here `notFound()` renders `[locale]/not-found` instead. */
export default function CatchAll() {
  notFound();
}
