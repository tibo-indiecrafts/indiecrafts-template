/**
 * Select editor modules or the code default for the blog frontpage.
 *
 * @see docs/reference/projects/web/website/src/app/locale/blog/frontpage-select.md
 */
import type { AnyModule } from "@indiecrafts/modules-web-blog/sanity/types";

/** The frontpage renders editor modules when any exist, else the code default. */
export function pickFrontpage(modules: AnyModule[] | undefined): "modules" | "default" {
  return modules && modules.length > 0 ? "modules" : "default";
}
