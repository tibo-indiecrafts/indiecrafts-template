"use client";

import Link from "next/link";
import React from "react";
import {
  Menu,
  X,
  Shield,
  SquareActivity,
  Sparkles,
  Cpu,
  Gem,
  ShoppingBag,
  BookOpen,
  Notebook,
  Croissant,
  Smartphone,
  Rocket,
  Cloud,
  Bot,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-effects/dark-landing-accordion";
import { Button } from "@/components/ui-effects/dark-landing-button";
import { Logo } from "@/components/layouts/_shared/logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui-effects/dark-landing-navigation-menu";
import { useMedia } from "@/components/_hooks/use-media";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { header10Namespace } from "./config";

interface FeatureLink {
  id: string;
  href: string;
  icon: React.ReactElement;
}

const features: FeatureLink[] = [
  {
    id: "ai",
    href: "#ux",
    icon: <Sparkles className="stroke-foreground fill-green-500/15" />,
  },
  {
    id: "performance",
    href: "#performance",
    icon: <SquareActivity className="stroke-foreground fill-indigo-500/15" />,
  },
  {
    id: "security",
    href: "#security",
    icon: <Shield className="stroke-foreground fill-blue-500/15" />,
  },
];

const moreFeatures: FeatureLink[] = [
  {
    id: "automation",
    href: "#ux",
    icon: <Bot className="stroke-foreground fill-yellow-500/15" />,
  },
  {
    id: "scalability",
    href: "#performance",
    icon: <Rocket className="stroke-foreground fill-orange-500/15" />,
  },
  {
    id: "backup",
    href: "#security",
    icon: <Cloud className="stroke-foreground fill-teal-500/15" />,
  },
  {
    id: "security",
    href: "#security",
    icon: <Shield className="stroke-foreground fill-blue-500/15" />,
  },
  {
    id: "partnerships",
    href: "#support",
    icon: <Gem className="stroke-foreground fill-pink-500/15" />,
  },
  {
    id: "mobile",
    href: "#mobile",
    icon: <Smartphone className="stroke-foreground fill-zinc-500/15" />,
  },
];

const useCases: FeatureLink[] = [
  {
    id: "marketplace",
    href: "#ux",
    icon: <ShoppingBag className="stroke-foreground fill-emerald-500/25" />,
  },
  {
    id: "api",
    href: "#security",
    icon: <Cpu className="stroke-foreground fill-blue-500/15" />,
  },
  {
    id: "partnerships",
    href: "#support",
    icon: <Gem className="stroke-foreground fill-pink-500/15" />,
  },
  {
    id: "mobile",
    href: "#mobile",
    icon: <Smartphone className="stroke-foreground fill-zinc-500/15" />,
  },
];

const contentLinks = [
  {
    id: "announcements",
    href: "#link",
    icon: <BookOpen className="stroke-foreground fill-purple-500/15" />,
  },
  {
    id: "resources",
    href: "#link",
    icon: <Croissant className="stroke-foreground fill-red-500/15" />,
  },
  {
    id: "blog",
    href: "#link",
    icon: <Notebook className="stroke-foreground fill-zinc-500/15" />,
  },
];

export function Header() {
  const [t, , tRoot] = useScopedT(header10Namespace);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const isLarge = useMedia("(min-width: 64rem)");

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      role="banner"
      data-state={isMobileMenuOpen ? "active" : "inactive"}
      {...(isScrolled && { "data-scrolled": true })}
      className="has-data-[state=open]:bg-background/50 fixed inset-x-0 top-0 z-50 has-data-[state=open]:h-screen has-data-[state=open]:backdrop-blur"
    >
      <div
        className={cn(
          "border-border-illustration absolute inset-x-0 top-0 z-50 h-14 border-b ring-1 ring-transparent transition-all duration-300",
          "in-data-scrolled:ring-border-illustration in-data-scrolled:bg-background/75 in-data-scrolled:border-transparent in-data-scrolled:backdrop-blur",
          "has-data-[state=open]:ring-foreground/5 has-data-[state=open]:bg-background/75 has-data-[state=open]:h-[calc(var(--navigation-menu-viewport-height)+3.4rem)] has-data-[state=open]:border-b has-data-[state=open]:border-transparent has-data-[state=open]:shadow-lg has-data-[state=open]:shadow-black/10 has-data-[state=open]:backdrop-blur",
          "max-lg:in-data-[state=active]:bg-background/75 max-lg:h-14 max-lg:overflow-hidden max-lg:border-b max-lg:in-data-[state=active]:h-screen max-lg:in-data-[state=active]:backdrop-blur",
        )}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative flex flex-wrap items-center justify-between lg:py-3">
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 hidden h-px bg-[linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] bg-size-[4px_1px] bg-repeat-x opacity-20 in-has-data-[state=open]:block"
            />
            <div className="flex items-center justify-between gap-8 max-lg:h-14 max-lg:w-full max-lg:border-b">
              <Link href="/" aria-label={t("actions.home")}>
                <Logo className="h-6" />
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label={
                  isMobileMenuOpen ? t("actions.closeMenu") : t("actions.openMenu")
                }
                className="relative z-20 -m-2.5 -mr-3 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-5 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-5 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
              </button>
            </div>

            {isLarge && (
              <div className="absolute inset-0 m-auto size-fit">
                <NavMenu tRoot={tRoot} />
              </div>
            )}

            {!isLarge && isMobileMenuOpen && (
              <MobileMenu closeMenu={() => setIsMobileMenuOpen(false)} tRoot={tRoot} />
            )}

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 in-data-[state=active]:flex max-lg:in-data-[state=active]:mt-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm">
                  <Link href="#">{t("actions.signIn")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

type TRoot = (key: string) => string;

function MobileMenu({ closeMenu, tRoot }: { closeMenu: () => void; tRoot: TRoot }) {
  const groups = [
    {
      groupId: "features",
      label: tRoot("blocks.header-10.menus.product"),
      links: features,
      namespace: "blocks.header-10.features",
    },
    {
      groupId: "useCases",
      label: tRoot("blocks.header-10.menus.solutions"),
      links: useCases,
      namespace: "blocks.header-10.useCases",
    },
  ];
  const flat = [
    { id: "pricing", label: tRoot("blocks.header-10.menus.pricing"), href: "#" },
    { id: "company", label: tRoot("blocks.header-10.menus.company"), href: "#" },
  ];

  return (
    <nav
      role="navigation"
      className="w-full [--color-border:--alpha(var(--color-foreground)/5%)] [--color-muted:--alpha(var(--color-foreground)/5%)]"
    >
      <Accordion
        type="single"
        collapsible
        className="-mx-4 mt-0.5 space-y-0.5 **:hover:no-underline"
      >
        {groups.map((g) => (
          <AccordionItem
            key={g.groupId}
            value={g.groupId}
            className="before:border-border group relative border-b-0 before:pointer-events-none before:absolute before:inset-x-4 before:bottom-0 before:border-b"
          >
            <AccordionTrigger className="data-[state=open]:bg-muted flex items-center justify-between px-4 py-3 text-lg **:font-normal!">
              {g.label}
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <ul>
                {g.links.map((feature) => (
                  <li key={feature.id}>
                    <Link
                      href={feature.href}
                      onClick={closeMenu}
                      className="grid grid-cols-[auto_1fr] items-center gap-2.5 px-4 py-2"
                    >
                      <div
                        aria-hidden
                        className="flex items-center justify-center *:size-4"
                      >
                        {feature.icon}
                      </div>
                      <div className="text-base">
                        {tRoot(`${g.namespace}.${feature.id}.name`)}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {flat.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          onClick={closeMenu}
          className="group relative block border-0 border-b py-4 text-lg"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function NavMenu({ tRoot }: { tRoot: TRoot }) {
  const menuRef = React.useRef<React.ElementRef<typeof NavigationMenu>>(null);

  const handleViewportHeight = () => {
    requestAnimationFrame(() => {
      const menuNode = menuRef.current;
      if (!menuNode) return;
      const openContent = document.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-viewport"][data-state="open"]',
      );
      if (openContent) {
        const height = openContent.scrollHeight;
        document.documentElement.style.setProperty(
          "--navigation-menu-viewport-height",
          `${height}px`,
        );
      } else {
        document.documentElement.style.removeProperty(
          "--navigation-menu-viewport-height",
        );
      }
    });
  };

  return (
    <NavigationMenu
      ref={menuRef}
      onValueChange={handleViewportHeight}
      className="[--color-muted:color-mix(in_oklch,var(--color-foreground)_5%,transparent)] [--viewport-outer-px:2rem] **:data-[slot=navigation-menu-viewport]:rounded-none **:data-[slot=navigation-menu-viewport]:border-0 **:data-[slot=navigation-menu-viewport]:bg-transparent **:data-[slot=navigation-menu-viewport]:shadow-none **:data-[slot=navigation-menu-viewport]:ring-0 **:data-[slot=navigation-menu-viewport-parent]:max-w-268 max-lg:hidden"
    >
      <NavigationMenuList className="gap-3">
        <NavigationMenuItem value="product">
          <NavigationMenuTrigger>
            {tRoot("blocks.header-10.menus.product")}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="mt-4.5 origin-top pt-5 pb-14 shadow-none ring-0">
            <div className="divide-foreground/10 grid w-full min-w-5xl grid-cols-4 gap-4 divide-x pr-12">
              <div className="row-span-2 -mr-2 grid grid-rows-subgrid gap-1 pr-2">
                <span className="text-muted-foreground ml-2 text-xs">
                  {tRoot("blocks.header-10.groups.features")}
                </span>
                <ul className="mt-1 space-y-2">
                  {features.map((feature) => (
                    <ListItem
                      key={feature.id}
                      href={feature.href}
                      title={tRoot(`blocks.header-10.features.${feature.id}.name`)}
                      description={tRoot(`blocks.header-10.features.${feature.id}.desc`)}
                    >
                      {feature.icon}
                    </ListItem>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 row-span-2 grid grid-rows-subgrid gap-1 border-r-0">
                <span className="text-muted-foreground ml-2 text-xs">
                  {tRoot("blocks.header-10.groups.moreFeatures")}
                </span>
                <ul className="mt-1 grid grid-cols-2 gap-2">
                  {moreFeatures.map((feature) => (
                    <ListItem
                      key={feature.id}
                      href={feature.href}
                      title={tRoot(`blocks.header-10.moreFeatures.${feature.id}.name`)}
                      description={tRoot(
                        `blocks.header-10.moreFeatures.${feature.id}.desc`,
                      )}
                    >
                      {feature.icon}
                    </ListItem>
                  ))}
                </ul>
              </div>
              <div className="row-span-2 grid grid-rows-subgrid gap-1">
                <span className="text-muted-foreground ml-2 text-xs">
                  {tRoot("blocks.header-10.groups.changelog")}
                </span>
                <div className="inset-ring-foreground/10 relative mt-3 grid overflow-hidden rounded-xl bg-blue-200 bg-linear-to-br from-pink-50 via-white/50 to-emerald-200 p-1 inset-ring-1 transition-colors duration-200 hover:bg-blue-300">
                  <div className="absolute inset-0 aspect-video px-6">
                    <div className="before:bg-background before:ring-foreground/10 after:ring-foreground/5 after:bg-background/75 group relative -mx-4 h-4/5 mask-b-from-35% px-4 pt-6 before:absolute before:inset-x-6 before:top-4 before:bottom-0 before:z-1 before:rounded-t-xl before:border before:border-transparent before:ring-1 after:absolute after:inset-x-9 after:top-2 after:bottom-0 after:rounded-t-xl after:border after:border-transparent after:ring-1">
                      <div className="bg-card ring-foreground/10 relative z-10 h-full overflow-hidden rounded-t-xl border border-transparent p-8 text-sm shadow-xl ring-1 shadow-black/25" />
                    </div>
                  </div>
                  <div className="space-y-0.5 self-end p-3">
                    <NavigationMenuLink
                      asChild
                      className="text-foreground p-0 text-sm font-medium before:absolute before:inset-0 hover:bg-transparent focus:bg-transparent"
                    >
                      <Link href="#">{tRoot("blocks.header-10.changelog.title")}</Link>
                    </NavigationMenuLink>
                    <p className="text-muted-foreground line-clamp-1 text-xs">
                      {tRoot("blocks.header-10.changelog.desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="solutions">
          <NavigationMenuTrigger>
            {tRoot("blocks.header-10.menus.solutions")}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="mt-4.5 origin-top pt-5 pb-12">
            <div className="divide-foreground/10 grid w-full min-w-5xl grid-cols-4 gap-4 divide-x pr-12">
              <div className="col-span-2 row-span-2 -mr-4 grid grid-rows-subgrid gap-1 pr-2">
                <span className="text-muted-foreground ml-2 text-xs">
                  {tRoot("blocks.header-10.groups.useCases")}
                </span>
                <ul className="mt-1 grid grid-cols-2 gap-2">
                  {useCases.map((useCase) => (
                    <ListItem
                      key={useCase.id}
                      href={useCase.href}
                      title={tRoot(`blocks.header-10.useCases.${useCase.id}.name`)}
                      description={tRoot(`blocks.header-10.useCases.${useCase.id}.desc`)}
                    >
                      {useCase.icon}
                    </ListItem>
                  ))}
                </ul>
              </div>
              <div className="row-span-2 grid grid-rows-subgrid gap-1 pl-2">
                <span className="text-muted-foreground ml-2 text-xs">
                  {tRoot("blocks.header-10.groups.content")}
                </span>
                <ul className="mt-1">
                  {contentLinks.map((content) => (
                    <NavigationMenuLink key={content.id} asChild>
                      <Link
                        href={content.href}
                        className="grid grid-cols-[auto_1fr] items-center gap-2.5"
                      >
                        {content.icon}
                        <div className="text-foreground text-sm font-medium">
                          {tRoot(`blocks.header-10.content.${content.id}`)}
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="pricing">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="#">{tRoot("blocks.header-10.menus.pricing")}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem value="company">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="#">{tRoot("blocks.header-10.menus.company")}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  description,
  children,
  href,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href} className="grid grid-cols-[auto_1fr] gap-3.5">
          <div className="bg-background ring-foreground/10 relative flex size-9 items-center justify-center rounded border border-transparent shadow-sm ring-1">
            {children}
          </div>
          <div className="space-y-0.5">
            <div className="text-foreground text-sm font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-1 text-xs">{description}</p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
