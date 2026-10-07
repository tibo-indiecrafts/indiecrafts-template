/**
 * Render the skip-to-content link as the first focusable element on the page.
 *
 * @see docs/reference/packages/web/ui-components/src/web/layout/SkipLink.md
 */

/**
 * Skip-to-content link for keyboard and screen-reader users. It targets the page's
 * `<main id="main" tabIndex={-1}>`. It sits off-screen (`-top-24`, not `sr-only`, so the
 * `top` transition can slide it in) until it gets focus. Never hide it with `display:
 * none` or `visibility: hidden`: that drops it from the tab order. The ring stacks a
 * `ring` color over a `background` offset, so it reads on any theme.
 */
export function SkipLink({
  label,
  href = "#main",
}: {
  label: string;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="bg-foreground text-background ring-ring ring-offset-background fixed -top-24 left-4 z-50 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-lg transition-[top] duration-200 ease-in-out focus:top-4 focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      {label}
    </a>
  );
}
