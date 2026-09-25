/**
 * Render the skip-to-content link as the first focusable element in the body.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/SkipLink.md
 */
import { useTranslations } from "next-intl";

/**
 * Skip-to-content link — first focusable element in `<body>`, targets the
 * `<main id="main" tabIndex={-1}>` rendered by `DefaultLayout`.
 *
 * Implementation notes (matters for screen-reader + keyboard users):
 *
 *   - Positioned off-screen with `-top-24` instead of `sr-only`. Both
 *     keep the link in the tab order, but off-screen positioning lets
 *     the `top` transition animate when focus arrives.
 *   - `transition-[top] duration-200 ease-in-out` smooths the slide-down.
 *   - The focus ring stacks a 2px brand-color ring + 2px background-color
 *     offset, so the indicator stays visible against any theme.
 *   - The link is rendered every page load — never hidden via `display:
 *     none` or `visibility: hidden`, which would drop it from the tab
 *     flow.
 */
export function SkipLink() {
  const t = useTranslations("common");
  return (
    <a
      href="#main"
      className="bg-foreground text-background ring-ring ring-offset-background fixed -top-24 left-4 z-50 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-lg transition-[top] duration-200 ease-in-out focus:top-4 focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      {t("skipToContent")}
    </a>
  );
}
