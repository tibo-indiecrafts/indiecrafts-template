"use client";
import Link from "next/link";
import { Button } from "@/components/ui-primitives/button";
import React from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui-primitives/navigation-menu";
import {
  Headset,
  Menu,
  X,
  Shield,
  SquareActivity,
  Sparkles,
  Cpu,
  Gem,
  ShoppingBag,
  GraduationCap,
  BookOpen,
  Notebook,
  Croissant,
} from "lucide-react";
import { useMedia } from "@/hooks/use-media";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layouts/_shared/logo";
import { LocaleSwitcher } from "@/components/layouts/_shared/locale-switcher";
import { ThemeToggle } from "@/components/layouts/_shared/theme-toggle";
import { features as featuresFlags } from "@/config";

interface FeatureLink {
  href: string;
  name: string;
  description?: string;
  icon: React.ReactElement;
}

interface MobileLink {
  groupName?: string;
  links?: FeatureLink[];
  name?: string;
  href?: string;
}

const features: FeatureLink[] = [
  {
    href: "#ux",
    name: "AI",
    description: "Generate Insights and Recommendations",
    icon: <Sparkles className="stroke-foreground fill-green-500/15" />,
  },
  {
    href: "#performance",
    name: "Performance",
    description: "Lightning-fast load times",
    icon: <SquareActivity className="stroke-foreground fill-indigo-500/15" />,
  },
  {
    href: "#security",
    name: "Security",
    description: "Keep your data safe and secure",
    icon: <Shield className="stroke-foreground fill-blue-500/15" />,
  },
  {
    href: "#support",
    name: "Customer Support",
    description: "Get help when you need it",
    icon: <Headset className="stroke-foreground fill-pink-500/15" />,
  },
];

const useCases: FeatureLink[] = [
  {
    href: "#ux",
    name: "Marketplace",
    description: "Find and buy AI tools",
    icon: <ShoppingBag className="stroke-foreground fill-emerald-500/25" />,
  },
  {
    href: "#performance",
    name: "Guides",
    description: "Learn how to use AI tools",
    icon: <GraduationCap className="stroke-foreground fill-indigo-500/15" />,
  },
  {
    href: "#security",
    name: "API Integration",
    description: "Integrate AI tools into your app",
    icon: <Cpu className="stroke-foreground fill-blue-500/15" />,
  },
  {
    href: "#support",
    name: "Partnerships",
    description: "Get help when you need it",
    icon: <Gem className="stroke-foreground fill-pink-500/15" />,
  },
];

const contentLinks: FeatureLink[] = [
  {
    name: "Announcements",
    href: "#link",
    icon: <BookOpen className="stroke-foreground fill-purple-500/15" />,
  },
  {
    name: "Resources",
    href: "#link",
    icon: <Croissant className="stroke-foreground fill-red-500/15" />,
  },
  {
    name: "Blog",
    href: "#link",
    icon: <Notebook className="stroke-foreground fill-zinc-500/15" />,
  },
];

const mobileLinks: MobileLink[] = [
  {
    groupName: "Product",
    links: features,
  },
  {
    groupName: "Solutions",
    links: [...useCases, ...contentLinks],
  },
  { name: "Pricing", href: "#" },
  { name: "Company", href: "#" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const isLarge = useMedia("(min-width: 64rem)");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <header
        role="banner"
        data-state={isMobileMenuOpen ? "active" : "inactive"}
        {...(isScrolled && { "data-scrolled": true })}
      >
        <div
          className={cn(
            "max-lg:in-data-[state=active]:bg-card/75 fixed inset-x-0 top-0 z-50 pt-2 max-lg:h-18 max-lg:overflow-hidden max-lg:px-2 max-lg:in-data-[state=active]:h-screen max-lg:in-data-[state=active]:backdrop-blur lg:pt-3",
          )}
        >
          <div
            className={cn(
              "in-data-scrolled:ring-foreground/5 in-data-scrolled:bg-background/75 mx-auto w-full max-w-6xl rounded-2xl border border-transparent px-3 shadow-md ring-1 shadow-transparent ring-transparent transition-all duration-500 ease-in-out in-data-scrolled:max-w-4xl in-data-scrolled:shadow-black/6.5 in-data-scrolled:backdrop-blur max-lg:in-data-scrolled:px-5",
              "max-lg:in-data-[state=active]:ring-foreground/5 max-lg:in-data-[state=active]:bg-background/75 max-lg:in-data-[state=active]:px-5 max-lg:in-data-[state=active]:shadow-black/6.5 max-lg:in-data-[state=active]:backdrop-blur",
            )}
          >
            <div className="relative flex flex-wrap items-center justify-between lg:py-3">
              <div className="flex items-center justify-between gap-8 max-lg:h-14 max-lg:w-full max-lg:in-data-[state=active]:border-b">
                <Link
                  href="/"
                  aria-label="home"
                  className="h-fit transition-all duration-500 lg:in-data-scrolled:px-2"
                >
                  <Logo />
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen == true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-3 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="m-auto size-5 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                  <X className="absolute inset-0 m-auto size-5 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
                </button>
              </div>

              {isLarge && (
                <div className="absolute inset-0 m-auto size-fit">
                  <NavMenu />
                </div>
              )}
              {!isLarge && isMobileMenuOpen && (
                <MobileMenu closeMenu={() => setIsMobileMenuOpen(false)} />
              )}

              <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 in-data-[state=active]:flex max-lg:in-data-[state=active]:mt-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  {featuresFlags.localeSwitcher ? <LocaleSwitcher /> : null}
                </div>
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="#">
                      <span>Sign In</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="#">
                      <span>Contact Sales</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>{" "}
    </>
  );
}

const MobileMenu = ({ closeMenu }: { closeMenu: () => void }) => {
  return (
    <nav role="navigation" className="w-full">
      <Accordion
        type="single"
        collapsible
        className="-mx-4 mt-0.5 space-y-0.5 **:hover:no-underline"
      >
        {mobileLinks.map((link, index) => {
          if (link.groupName && link.links) {
            return (
              <AccordionItem
                key={index}
                value={link.groupName}
                className="group relative border-b-0 before:pointer-events-none before:absolute before:inset-x-4 before:bottom-0 before:border-b"
              >
                <AccordionTrigger className="data-[state=open]:bg-foreground/5 flex items-center justify-between px-4 py-3 text-lg **:!font-normal">
                  {link.groupName}
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul>
                    {link.links.map((feature, featureIndex) => (
                      <li key={featureIndex}>
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
                          <div className="text-base">{feature.name}</div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          }
          return null;
        })}
      </Accordion>
      {mobileLinks.map((link, index) => {
        if (link.name && link.href) {
          return (
            <Link
              key={index}
              href={link.href}
              onClick={closeMenu}
              className="group relative block border-0 border-b py-4 text-lg"
            >
              {link.name}
            </Link>
          );
        }
        return null;
      })}
    </nav>
  );
};

const NavMenu = () => {
  return (
    <NavigationMenu
      viewport={false}
      className="**:data-[slot=navigation-menu-content]:top-12 max-lg:hidden"
    >
      <NavigationMenuList className="gap-3">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <div className="w-72">
              <div className="bg-card ring-border relative rounded-xl p-0.5 pt-2 shadow ring-1">
                <span className="text-muted-foreground ml-3 text-xs font-medium uppercase">
                  Features
                </span>
                <ul className="mt-1">
                  {features.map((feature, index) => (
                    <ListItem
                      key={index}
                      href={feature.href}
                      title={feature.name}
                      description={feature.description}
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
                  <Link href="#" className="text-primary">
                    More features
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent className="grid min-w-lg grid-cols-[auto_1fr] gap-1.5 p-0">
            <div className="bg-card ring-border rounded-xl p-0.5 pt-2 shadow ring-1">
              <span className="text-muted-foreground ml-3 text-xs font-medium uppercase">
                Use Cases
              </span>
              <ul className="mt-1">
                {useCases.map((useCase, index) => (
                  <ListItem
                    key={index}
                    href={useCase.href}
                    title={useCase.name}
                    description={useCase.description}
                  >
                    {useCase.icon}
                  </ListItem>
                ))}
              </ul>
            </div>
            <div className="p-0.5 pt-2">
              <span className="text-muted-foreground ml-3 text-xs font-medium uppercase">
                Content
              </span>
              <ul className="mt-1">
                {contentLinks.map((content, index) => (
                  <NavigationMenuLink key={index} asChild>
                    <Link
                      href={content.href}
                      className="grid grid-cols-[auto_1fr] items-center gap-2.5 px-3"
                    >
                      {content.icon}
                      <div className="text-foreground text-sm font-medium">
                        {content.name}
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
            <Link href="#">Pricing</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="#">Company</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

function ListItem({
  title,
  description,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  title: string;
  description?: string;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="grid grid-cols-[auto_1fr] gap-2.5 p-3">
          <div className="bg-illustration ring-foreground/10 before:to-foreground/3 relative flex size-9 items-center justify-center rounded-lg border border-transparent shadow shadow-sm ring-1 *:drop-shadow *:drop-shadow-black/6.5 before:absolute before:inset-0 before:rounded-lg before:bg-radial">
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
