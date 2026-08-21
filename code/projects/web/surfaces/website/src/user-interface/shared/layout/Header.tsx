"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Logo } from "@/user-interface/shared/layout/Logo";
import { LocaleSwitcher } from "@/user-interface/shared/layout/LocaleSwitcher";
import { ThemeToggle } from "@/user-interface/shared/layout/ThemeToggle";
import { AuthMenu } from "@/user-interface/shared/layout/AuthMenu";
import { NavIcon } from "@/user-interface/shared/components/NavIcon";
import { Link } from "@/i18n/routing";
import type { ThemeMode } from "@/config";
import type { NavItem, NavLeaf } from "@/lib/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@indiecrafts/packages-web-ui/web/navigation-menu";

/**
 * Production site header. Logo + nav from the `navigation` singleton in Sanity
 * (resolved by `getNavigation`), locale switcher, theme toggle. Header items are
 * plain links or dropdown groups; dropdown children may carry an icon + a short
 * description (rich links) via the shadcn NavigationMenu.
 *
 * Lives in `@/user-interface/layout` (not imported from the sibling component library)
 * so the production header can evolve independently. Fixed at the top —
 * DefaultLayout's `<main>` adds `pt-14 lg:pt-20` to clear the header height.
 */
type HeaderProps = {
  name: string;
  logo?: string;
  logoDark?: string;
  items?: NavItem[];
  /** Resolved server-side from Sanity `themeModes` + `showLocaleSwitcher` (client can't await). */
  showThemeToggle?: boolean;
  themeModes?: readonly ThemeMode[];
  showLocaleSwitcher?: boolean;
};

const topLinkClass =
  "text-muted-foreground hover:text-foreground flex-row items-center gap-1.5 px-3 py-2 font-normal";

/**
 * The `<a>`/`<Link>` element for a leaf — passed as the `asChild` target of a
 * `NavigationMenuLink`. Styling is set on `NavigationMenuLink` (which
 * tailwind-merges with its base) and injected here by the Radix Slot — do NOT
 * set className on the anchor itself, or the two class strings won't dedupe.
 */
function leafAnchor(leaf: NavLeaf, children: ReactNode) {
  const target = leaf.newTab ? "_blank" : undefined;
  if (leaf.kind === "external") {
    return (
      <a
        href={leaf.href}
        target={target}
        rel={leaf.newTab ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={leaf.href} target={target}>
      {children}
    </Link>
  );
}

export function Header({
  name,
  logo,
  logoDark,
  items = [],
  showThemeToggle = false,
  themeModes = [],
  showLocaleSwitcher = true,
}: HeaderProps) {
  const tNav = useTranslations("nav");
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-(--max-container) items-center justify-between px-(--gutter) lg:h-20">
        <Link
          href="/"
          aria-label={tNav("home")}
          className="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
        >
          <Logo name={name} logo={logo} logoDark={logoDark} />
        </Link>
        <div className="flex items-center gap-1">
          {items.length > 0 ? (
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                {items.map((item, i) => (
                  <NavigationMenuItem key={i}>
                    {item.kind === "group" ? (
                      <>
                        <NavigationMenuTrigger className="text-muted-foreground data-[state=open]:text-foreground bg-transparent px-3 font-normal">
                          {item.icon ? <NavIcon name={item.icon} /> : null}
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[320px] gap-1 p-2">
                            {item.children.map((leaf, j) => (
                              <li key={j}>
                                <NavigationMenuLink
                                  asChild
                                  className="flex-row items-start gap-3"
                                >
                                  {leafAnchor(
                                    leaf,
                                    <>
                                      {leaf.icon ? (
                                        <NavIcon name={leaf.icon} size={18} />
                                      ) : null}
                                      <span className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">
                                          {leaf.label}
                                        </span>
                                        {leaf.description ? (
                                          <span className="text-muted-foreground text-xs">
                                            {leaf.description}
                                          </span>
                                        ) : null}
                                      </span>
                                    </>,
                                  )}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild className={topLinkClass}>
                        {leafAnchor(
                          item,
                          <>
                            {item.icon ? <NavIcon name={item.icon} /> : null}
                            {item.label}
                          </>,
                        )}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          ) : null}
          {showLocaleSwitcher ? <LocaleSwitcher /> : null}
          {showThemeToggle ? <ThemeToggle modes={themeModes} /> : null}
          <AuthMenu />
        </div>
      </div>
    </header>
  );
}
