"use client";

/**
 * Render the production site header with navigation, locale, theme, and auth controls.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/Header.md
 */

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Logo } from "@/user-interface/shared/layout/Logo";
import { LocaleSwitcher } from "@/user-interface/shared/layout/LocaleSwitcher";
import { ThemeToggle } from "@/user-interface/shared/layout/ThemeToggle";
import { AuthMenu } from "@/user-interface/shared/layout/AuthMenu";
import { NavIcon } from "@/user-interface/shared/components/NavIcon";
import { Link } from "@/i18n/routing";
import type { ThemeMode } from "@/config";
import type { NavItem, NavLeaf } from "@/lib/navigation";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@indiecrafts/packages-web-ui/web/navigation-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@indiecrafts/packages-web-ui/web/sheet";

/**
 * Production site header. Logo + nav from the `navigation` singleton in Sanity
 * (resolved by `getNavigation`), locale switcher, theme toggle. Header items are
 * plain links or dropdown groups; dropdown children may carry an icon + a short
 * description (rich links) via the shadcn NavigationMenu.
 *
 * The desktop NavigationMenu is `lg`-only; below `lg` the same items open in a
 * Radix `Sheet` (focus trap + Escape + return-focus for free) via the hamburger,
 * so the nav never overflows a narrow viewport (WCAG 1.4.10 reflow).
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

const mobileLinkClass =
  "text-foreground hover:bg-accent flex items-center gap-3 rounded-md px-3 py-2.5 text-base";

/**
 * The `<a>`/`<Link>` element for a leaf. On desktop it is the `asChild` target of a
 * `NavigationMenuLink`, which injects styling via the Radix Slot — so leave
 * `className` unset there (a className on the anchor won't dedupe against the
 * Slot's). The mobile drawer has no Slot, so it passes `className` directly.
 */
function leafAnchor(leaf: NavLeaf, children: ReactNode, className?: string) {
  const target = leaf.newTab ? "_blank" : undefined;
  if (leaf.kind === "external") {
    return (
      <a
        href={leaf.href}
        target={target}
        rel={leaf.newTab ? "noopener noreferrer" : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={leaf.href} target={target} className={className}>
      {children}
    </Link>
  );
}

/** A leaf link in the mobile drawer — tapping it closes the sheet and navigates. */
function mobileLeaf(leaf: NavLeaf, key: number) {
  return (
    <SheetClose asChild key={key}>
      {leafAnchor(
        leaf,
        <>
          {leaf.icon ? <NavIcon name={leaf.icon} /> : null}
          {leaf.label}
        </>,
        mobileLinkClass,
      )}
    </SheetClose>
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
            <>
              <NavigationMenu viewport={false} className="hidden lg:flex">
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
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="lg:hidden"
                    aria-label={tNav("openMenu")}
                  >
                    <Menu aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" aria-describedby={undefined}>
                  <SheetHeader>
                    <SheetTitle>{tNav("menu")}</SheetTitle>
                  </SheetHeader>
                  <nav
                    aria-label={tNav("menu")}
                    className="flex flex-col gap-1 overflow-y-auto px-2 pb-4"
                  >
                    {items.map((item, i) =>
                      item.kind === "group" ? (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-muted-foreground flex items-center gap-2 px-3 pt-3 pb-1 text-sm font-medium">
                            {item.icon ? <NavIcon name={item.icon} /> : null}
                            {item.label}
                          </span>
                          {item.children.map((leaf, j) => mobileLeaf(leaf, j))}
                        </div>
                      ) : (
                        mobileLeaf(item, i)
                      ),
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : null}
          {showLocaleSwitcher ? <LocaleSwitcher className="size-10" /> : null}
          {showThemeToggle ? (
            <ThemeToggle modes={themeModes} className="size-10" />
          ) : null}
          <AuthMenu />
        </div>
      </div>
    </header>
  );
}
