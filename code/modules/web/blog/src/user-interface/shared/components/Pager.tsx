import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@indiecrafts/packages-web-i18n";

/**
 * Previous / next pager for a blog listing. Pure presentational — the route
 * computes `page` + `pageCount` (via `lib/pagination`) and passes labels, so
 * this stays translation-agnostic. Renders nothing on a single page.
 *
 * Page 1 links to the bare `basePath` (no `?page=1`) to keep one canonical URL
 * per listing; deeper pages are crawlable through the real `<a>` links.
 */
export function Pager({
  page,
  pageCount,
  basePath,
  labels,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  labels: { label: string; previous: string; next: string; status: string };
}) {
  if (pageCount <= 1) return null;

  const hrefFor = (n: number) => (n <= 1 ? basePath : `${basePath}?page=${n}`);
  const status = labels.status
    .replace("{page}", String(page))
    .replace("{total}", String(pageCount));

  const linkClass =
    "text-foreground hover:text-brand focus-visible:ring-ring inline-flex items-center gap-1 rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none";

  return (
    <nav
      aria-label={labels.label}
      className="border-border/60 mt-4 flex items-center justify-between gap-4 border-t pt-6"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={linkClass}>
          <ChevronLeft aria-hidden="true" className="size-4" />
          {labels.previous}
        </Link>
      ) : (
        <span />
      )}

      <span className="text-muted-foreground text-sm">{status}</span>

      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} rel="next" className={linkClass}>
          {labels.next}
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
