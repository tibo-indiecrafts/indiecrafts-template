"use client";

/**
 * Renders a horizontal category bar with dropdowns for categories that have children.
 *
 * @see docs/reference/packages/web/ui-components/src/web/layout/CategoryNav.md
 */

import { cn } from "@indiecrafts/packages-shared-utils/cn";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@indiecrafts/packages-web-ui/web/navigation-menu";

/** A leaf link in the category nav — a resolved title + href. */
export type CategoryNavChild = { _key?: string; title: string; href: string };

/** A top-level category — a plain link, or a dropdown when it has children. */
export type CategoryNavItem = CategoryNavChild & {
  children?: CategoryNavChild[];
};

/**
 * Category nav bar — a horizontal row of top-level categories. A category with
 * children opens a dropdown (shadcn `NavigationMenu`, so keyboard + focus are
 * handled); one without is a plain link. Data-driven: resolved `{ title, href }`
 * items (plain `<a>`, like the other renderers — the host localizes the hrefs).
 * Renders nothing with no items. The dropdown leads with an "all of {category}"
 * link (`allLabel` + the parent title) to the parent's own listing.
 */
export function CategoryNav({
  items,
  label,
  allLabel,
}: {
  items: CategoryNavItem[];
  label: string;
  allLabel: string;
}) {
  if (!items?.length) return null;
  return (
    <nav aria-label={label} className="border-border/60 border-b">
      <div className="mx-auto max-w-6xl px-(--gutter)">
        <NavigationMenu className="max-w-none justify-start">
          <NavigationMenuList className="flex-wrap justify-start gap-0.5">
            {items.map((cat) =>
              cat.children?.length ? (
                <NavigationMenuItem key={cat._key ?? cat.href}>
                  <NavigationMenuTrigger className="bg-transparent capitalize">
                    {cat.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-56 gap-0.5 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href={cat.href}
                            className="hover:bg-muted focus:bg-muted text-muted-foreground block rounded-md px-3 py-2 text-sm capitalize"
                          >
                            {allLabel} {cat.title}
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {cat.children.map((child) => (
                        <li key={child._key ?? child.href}>
                          <NavigationMenuLink asChild>
                            <a
                              href={child.href}
                              className="hover:bg-muted focus:bg-muted block rounded-md px-3 py-2 text-sm font-medium capitalize"
                            >
                              {child.title}
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={cat._key ?? cat.href}>
                  <NavigationMenuLink asChild>
                    <a
                      href={cat.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent capitalize",
                      )}
                    >
                      {cat.title}
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
