import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";

const meta: Meta<typeof NavigationMenu> = {
  title: "UI Primitives/NavigationMenu",
  component: NavigationMenu,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof NavigationMenu>;

const components = [
  {
    title: "Alert Dialog",
    href: "#",
    description: "A modal dialog that interrupts the user with important content.",
  },
  {
    title: "Hover Card",
    href: "#",
    description: "Sighted users can preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "#",
    description: "Displays an indicator showing the completion progress.",
  },
  {
    title: "Tabs",
    href: "#",
    description: "Switch between content panels under a single trigger.",
  },
];

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[420px] gap-3 p-4 md:grid-cols-2">
              {components.map((c) => (
                <li key={c.title}>
                  <NavigationMenuLink asChild>
                    <a
                      className="hover:bg-accent hover:text-accent-foreground block rounded-md p-3 leading-none"
                      href={c.href}
                    >
                      <div className="text-sm font-medium">{c.title}</div>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {c.description}
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="#docs">Docs</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
