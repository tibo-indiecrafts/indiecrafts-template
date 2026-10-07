/**
 * Read and write post_views — the anonymous per-post, per-day view counter behind the
 * website blog's "Trending" block. No personal data: no IP, no user id, no cookie.
 *
 * @see docs/reference/shared/api/src/views/post-views.md
 */

/** A published Sanity document id: letters, digits, `.`, `_`, `-`; ≤ 128 chars. Draft and
 *  release ids (`drafts.*`, `versions.*`) are never counted. */
export function isValidPostId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 128 &&
    /^[A-Za-z0-9._-]+$/.test(value) &&
    !value.startsWith("drafts.") &&
    !value.startsWith("versions.")
  );
}

/** A locale code: `en` or `en-GB`. */
export function isValidLocale(value: unknown): value is string {
  return typeof value === "string" && /^[a-z]{2}(-[A-Z]{2})?$/.test(value);
}

/** The UTC day (`YYYY-MM-DD`) `daysAgo` days before `now`. */
export function utcDay(now: Date, daysAgo = 0): string {
  return new Date(now.getTime() - daysAgo * 86_400_000)
    .toISOString()
    .slice(0, 10);
}

/** One view → +1 on the (post, locale, day) counter. One upsert statement, no read. */
export async function recordView(
  db: D1Database,
  postId: string,
  locale: string,
  day: string,
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO post_views (post_id, locale, day, views) VALUES (?, ?, ?, 1) ON CONFLICT (post_id, locale, day) DO UPDATE SET views = views + 1",
    )
    .bind(postId, locale, day)
    .run();
}

/** Post ids for `locale`, most viewed since `sinceDay` (inclusive) first; ties by id. */
export async function topPostIds(
  db: D1Database,
  locale: string,
  sinceDay: string,
  limit: number,
): Promise<string[]> {
  const { results } = await db
    .prepare(
      "SELECT post_id FROM post_views WHERE locale = ? AND day >= ? GROUP BY post_id ORDER BY SUM(views) DESC, post_id LIMIT ?",
    )
    .bind(locale, sinceDay, limit)
    .all<{ post_id: string }>();
  return results.map((r) => r.post_id);
}
