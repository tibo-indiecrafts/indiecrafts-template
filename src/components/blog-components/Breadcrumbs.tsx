import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Reusable breadcrumbs trail — used by author + category routes.
 * Pass items in order; the last item is rendered as plain text (current
 * page) and gets `aria-current="page"`. Emits `BreadcrumbList` JSON-LD
 * inline so the trail also helps search engines.
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
    <nav aria-label={label} className={cn("text-muted-foreground text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="focus-visible:ring-ring rounded opacity-80 transition hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-semibold"
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 opacity-60" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
