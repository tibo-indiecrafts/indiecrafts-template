import type { AnyModule } from "@indiecrafts/modules-web-blog/sanity/types";

/** The frontpage renders editor modules when any exist, else the code default. */
export function pickFrontpage(modules: AnyModule[] | undefined): "modules" | "default" {
  return modules && modules.length > 0 ? "modules" : "default";
}
