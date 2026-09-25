/**
 * Inject this app's feature flags into the islands it mounts at boot.
 *
 * @see docs/reference/projects/web/website/src/lib/islands.md
 */
import { configureBlog } from "@indiecrafts/modules-web-blog/lib/config";
import { configureBlocks } from "@indiecrafts/packages-web-ui-components/web/features";
import { features, pages } from "@/config";

/**
 * Inject **this app's** config into the islands it mounts. The blog + the
 * newsletter/waitlist page-builder blocks read app-injected flags (they can't
 * import an app), so this is what makes this app's feature toggles take effect —
 * and what lets a second app mount the same islands with a different set.
 *
 * Called once at boot from `instrumentation.ts` (runs before any route). Each
 * island ships template-matching defaults, so the app is correct even if this
 * hasn't run yet. See `code/docs/shared/architecture/multi-app.md`.
 */
export function configureIslands(): void {
  configureBlog({
    flags: {
      blog: features.blog,
      rss: features.rss,
      comments: features.blogComments,
      search: features.blogSearch,
      series: features.blogSeries,
      taxonomy: features.blogTaxonomy,
    },
    blogPage: pages.blog,
  });
  configureBlocks({
    newsletter: features.newsletter,
    waitlist: features.waitlist,
    contact: features.contact,
  });
}
