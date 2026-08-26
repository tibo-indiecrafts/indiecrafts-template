import type { Locale } from "@indiecrafts/packages-shared-config";

/**
 * Popularity signal for the Trending block. Project 1 has no read-count
 * source, so this returns `[]` and the renderer falls back to most-recent.
 * Project 2 (read-count pipeline) replaces the body; the Trending block is
 * unchanged.
 *
 * @debt MIGRATION - wire to the read-count store (Analytics Engine / D1) in Project 2.
 */
export async function getPopularPostIds(
  _locale: Locale,
  _count: number,
): Promise<string[]> {
  return [];
}
