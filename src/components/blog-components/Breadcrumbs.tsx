import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";

/**
 * Reusable breadcrumbs trail — used by author + category routes.
 * Pass items in order; the last item is rendered as plain text (current
 * page) and gets `aria-current="page"`. Emits `BreadcrumbList` JSON-LD
 * inline so the trail also helps search engines.
 */
export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  if (!items.length) return null;
  return (
    <nav aria-label={label} className="text-muted-foreground text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="text-foreground"
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
