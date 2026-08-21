import { ChevronRight } from "lucide-react";
import { Link } from "@indiecrafts/packages-web-i18n";
import { cn } from "@indiecrafts/packages-shared-utils/cn";

/**
 * Reusable breadcrumbs trail — used by author + category routes.
 * Pass items in order; the last item is rendered as plain text (current
 * page) and gets `aria-current="page"`. Renders the visual + ARIA trail
 * only — the `BreadcrumbList` JSON-LD is emitted separately by each route's
 * `<PageSchemas>` (`buildBreadcrumbSchema`), so the crumbs live in two
 * places on purpose: the visual trail here, the machine trail in the head.
 *
 * Link + current-page styling uses opacity + font-weight rather than
 * hard-coded colours, so passing `className="text-white/85"` (or similar)
 * cascades through the whole component — useful when the trail sits on a
 * dark hero background.
 */
export type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  label,
  className,
}: {
  items: Crumb[];
  label: string;
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <nav
      aria-label={label}
      className={cn("text-muted-foreground text-sm", className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={item.href ?? item.label}
              className="flex min-w-0 items-center gap-1.5"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="focus-visible:ring-ring rounded opacity-80 transition hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              ) : (
                // Current page — truncate so a long title/name ellipsizes
                // instead of wrapping (matters in the post hero's pill on
                // mobile, and for long category/author names anywhere).
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="max-w-[60vw] truncate font-semibold sm:max-w-sm"
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 opacity-60"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
