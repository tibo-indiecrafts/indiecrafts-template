/**
 * Render the "Part N of M" series navigation on a post.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/post/components/SeriesNav.md
 */
import { Link } from "@indiecrafts/packages-web-i18n";
import type { SeriesRef } from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * "Part N of M" series nav on a post — the ordered list of parts, current one
 * marked, each other linked. Renders nothing for a lone post (< 2 parts).
 * `parts` + order come from `postBySlugQuery`'s `series` projection.
 */
export function SeriesNav({
  series,
  currentId,
  labels,
}: {
  series: SeriesRef;
  currentId: string;
  labels: { label: string; partOf: string };
}) {
  const parts = series.parts ?? [];
  if (parts.length < 2 || !series.slug) return null;

  const index = parts.findIndex((p) => p._id === currentId);
  const partOf = labels.partOf
    .replace("{n}", String(index >= 0 ? index + 1 : 1))
    .replace("{total}", String(parts.length));

  return (
    <nav
      aria-label={labels.label}
      className="bg-muted/40 ring-border/60 rounded-2xl p-6 ring-1"
    >
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {partOf}
      </p>
      {series.title ? (
        <Link
          href={`/blog/series/${series.slug}`}
          className="hover:text-brand focus-visible:ring-ring mt-1 inline-block rounded text-lg font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {series.title}
        </Link>
      ) : null}
      <ol className="mt-4 flex flex-col gap-2 text-sm">
        {parts.map((p, i) => (
          <li key={p._id} className="flex gap-2">
            <span className="text-muted-foreground tabular-nums">{i + 1}.</span>
            {p._id === currentId ? (
              <span aria-current="true" className="text-foreground font-medium">
                {p.title}
              </span>
            ) : p.slug ? (
              <Link
                href={`/blog/${p.slug}`}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {p.title}
              </Link>
            ) : (
              <span className="text-muted-foreground">{p.title}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
