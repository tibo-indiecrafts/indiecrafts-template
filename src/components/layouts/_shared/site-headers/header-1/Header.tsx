"use client";

import * as React from "react";
import {
  BookOpen,
  Cpu,
  Croissant,
  Gem,
  GraduationCap,
  Headset,
  Menu,
  Notebook,
  Shield,
  ShoppingBag,
  Sparkles,
  SquareActivity,
  X,
} from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { features as featuresFlags } from "@/config/features.config";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/layouts/_shared/logo";
import { LocaleSwitcher } from "@/components/layouts/_shared/locale-switcher";
import { ThemeToggle } from "@/components/layouts/_shared/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { Button } from "@/components/ui-primitives/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui-primitives/navigation-menu";
import { useMedia } from "@/hooks/use-media";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { header1Namespace } from "./config";

type FeatureLink = {
  id: string;
  href: string;
  icon: React.ReactElement;
};
type MobileEntry =
  | { groupId: string; items: readonly FeatureLink[] }
  | { id: string; href: string };

const features: readonly FeatureLink[] = [
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
  {
    id: "support",
    href: "#support",
    icon: <Headset className="stroke-foreground fill-pink-500/15" />,
  },
];

const useCases: readonly FeatureLink[] = [
  {
    id: "marketplace",
    href: "#ux",
    icon: <ShoppingBag className="stroke-foreground fill-emerald-500/25" />,
  },
  {
    id: "guides",
    href: "#performance",
    icon: <GraduationCap className="stroke-foreground fill-indigo-500/15" />,
  },
  {
    id: "api-integration",
    href: "#security",
    icon: <Cpu className="stroke-foreground fill-blue-500/15" />,
  },
  {
    id: "partnerships",
    href: "#support",
    icon: <Gem className="stroke-foreground fill-pink-500/15" />,
  },
];

const contentLinks: readonly FeatureLink[] = [
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

const mobileEntries: readonly MobileEntry[] = [
  { groupId: "product", items: features },
  { groupId: "solutions", items: [...useCases, ...contentLinks] },
  { id: "pricing", href: "#" },
  { id: "company", href: "#" },
];

function isGroup(entry: MobileEntry): entry is Extract<MobileEntry, { groupId: string }> {
  return "groupId" in entry;
}

export function Header() {
  const [t] = useScopedT(header1Namespace);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const isLarge = useMedia("(min-width: 64rem)");

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <header
      role="banner"
      data-state={isMobileMenuOpen ? "active" : "inactive"}
      {...(isScrolled && { "data-scrolled": true })}
    >
      <div
        className={cn(
          "in-data-scrolled:bg-background/50 fixed inset-x-0 top-0 z-50 in-data-scrolled:border-b in-data-scrolled:backdrop-blur",
          !isLarge && "h-14 overflow-hidden border-b",
          isMobileMenuOpen && "bg-background/75 h-screen backdrop-blur",
        )}
      >
        <div className="mx-auto max-w-(--max-container) px-(--gutter) lg:px-12">
          <div className="relative flex flex-wrap items-center justify-between lg:py-5">
            <div className="flex justify-between gap-8 max-lg:h-14 max-lg:w-full max-lg:border-b">
              <Link
                href="/"
                aria-label={t("homeLabel")}
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              {isLarge ? <NavMenu /> : null}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
                aria-expanded={isMobileMenuOpen}
                className="relative z-20 -m-2.5 -mr-3 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  aria-hidden="true"
                  className="m-auto size-5 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0"
                />
                <X
                  aria-hidden="true"
                  className="absolute inset-0 m-auto size-5 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100"
                />
              </button>
            </div>

            {!isLarge && isMobileMenuOpen ? (
              <MobileMenu closeMenu={() => setIsMobileMenuOpen(false)} />
            ) : null}

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 in-data-[state=active]:flex max-lg:in-data-[state=active]:mt-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-3 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                {featuresFlags.localeSwitcher ? <LocaleSwitcher /> : null}
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm">
                  <Link href={"#" as Parameters<typeof Link>[0]["href"]}>
                    <span>{t("loginLabel")}</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={"#" as Parameters<typeof Link>[0]["href"]}>
                    <span>{t("ctaLabel")}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ closeMenu }: Readonly<{ closeMenu: () => void }>) {
  const [t] = useScopedT(header1Namespace);
  return (
    <nav role="navigation" className="w-full">
      <Accordion
        type="single"
        collapsible
        className="-mx-4 mt-0.5 space-y-0.5 **:hover:no-underline"
      >
        {mobileEntries.map((entry, index) => {
          if (!isGroup(entry)) return null;
          const items: readonly FeatureLink[] = entry.items;
          return (
            <AccordionItem
              key={`group-${index}`}
              value={entry.groupId}
              className="group relative border-b-0 before:pointer-events-none before:absolute before:inset-x-4 before:bottom-0 before:border-b"
            >
              <AccordionTrigger className="data-[state=open]:bg-foreground/5 flex items-center justify-between px-4 py-3 text-lg **:!font-normal">
                {t(`groups.${entry.groupId}`)}
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <ul>
                  {items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href as Parameters<typeof Link>[0]["href"]}
                        onClick={closeMenu}
                        className="grid grid-cols-[auto_1fr] items-center gap-2.5 px-4 py-2"
                      >
                        <div
                          aria-hidden
                          className="flex items-center justify-center *:size-4"
                        >
                          {item.icon}
                        </div>
                        <div className="text-base">
                          {mobileItemLabel(t, item.id, entry.groupId)}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      {mobileEntries.map((entry, index) => {
        if (isGroup(entry)) return null;
        return (
          <Link
            key={`flat-${index}`}
            href={entry.href as Parameters<typeof Link>[0]["href"]}
            onClick={closeMenu}
            className="group relative block border-0 border-b py-4 text-lg"
          >
            {t(`links.${entry.id}`)}
          </Link>
        );
      })}
    </nav>
  );
}

function NavMenu() {
  const [t] = useScopedT(header1Namespace);
  return (
    <NavigationMenu className="**:data-[slot=navigation-menu-viewport]:top-3 **:data-[slot=navigation-menu-viewport]:left-8 max-lg:hidden">
      <NavigationMenuList className="gap-3">
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("groups.product")}</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <div className="w-72">
              <div className="bg-card ring-border relative rounded-xl p-0.5 pt-2 shadow ring-1">
                <span className="text-muted-foreground ml-3 text-xs font-medium uppercase">
                  {t("panels.features")}
                </span>
                <ul className="mt-1">
                  {features.map((feature) => (
                    <ListItem
                      key={feature.id}
                      href={feature.href}
                      title={t(`features.${feature.id}.name`)}
                      description={t(`features.${feature.id}.description`)}
                    >
                      {feature.icon}
                    </ListItem>
                  ))}
                </ul>
              </div>
              <div className="-mt-2">
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle({
                    className: "w-full items-start pt-7 pb-5",
                  })}
                >
                  <Link
                    href={"#" as Parameters<typeof Link>[0]["href"]}
                    className="text-primary"
                  >
                    {t("moreFeatures")}
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("groups.solutions")}</NavigationMenuTrigger>
          <NavigationMenuContent className="grid min-w-lg grid-cols-[auto_1fr] gap-1.5 p-0">
            <div className="bg-card ring-border rounded-xl p-0.5 pt-2 shadow ring-1">
              <span className="text-muted-foreground ml-3 text-xs font-medium uppercase">
                {t("panels.useCases")}
              </span>
              <ul className="mt-1">
                {useCases.map((useCase) => (
                  <ListItem
                    key={useCase.id}
                    href={useCase.href}
                    title={t(`useCases.${useCase.id}.name`)}
                    description={t(`useCases.${useCase.id}.description`)}
                  >
                    {useCase.icon}
                  </ListItem>
                ))}
              </ul>
            </div>
            <div className="p-0.5 pt-2">
              <span className="text-muted-foreground ml-3 text-xs font-medium uppercase">
                {t("panels.content")}
              </span>
              <ul className="mt-1">
                {contentLinks.map((content) => (
                  <NavigationMenuLink key={content.id} asChild>
                    <Link
                      href={content.href as Parameters<typeof Link>[0]["href"]}
                      className="grid grid-cols-[auto_1fr] items-center gap-2.5 px-3"
                    >
                      {content.icon}
                      <div className="text-foreground text-sm font-medium">
                        {t(`contentLinks.${content.id}.name`)}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={"#" as Parameters<typeof Link>[0]["href"]}>
              {t("links.pricing")}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={"#" as Parameters<typeof Link>[0]["href"]}>
              {t("links.company")}
            </Link>
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
}: Readonly<{
  href: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}>) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href as Parameters<typeof Link>[0]["href"]}
          className="grid grid-cols-[auto_1fr] gap-2.5 p-3"
        >
          <div className="bg-card ring-foreground/10 relative flex size-9 items-center justify-center rounded-lg border border-transparent shadow-sm ring-1 *:drop-shadow-sm">
            {children}
          </div>
          <div className="space-y-0.5">
            <div className="text-foreground text-sm font-medium">{title}</div>
            {description ? (
              <p className="text-muted-foreground line-clamp-1 text-xs">{description}</p>
            ) : null}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function mobileItemLabel(
  t: ReturnType<typeof useTranslations>,
  id: string,
  groupId: string,
): string {
  if (groupId === "product") return t(`features.${id}.name`);
  if (groupId === "solutions") {
    const inUseCases = useCases.some((u) => u.id === id);
    return inUseCases ? t(`useCases.${id}.name`) : t(`contentLinks.${id}.name`);
  }
  return id;
}
