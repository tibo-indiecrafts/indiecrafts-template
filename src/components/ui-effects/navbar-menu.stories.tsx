import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./navbar-menu";

const meta: Meta<typeof Menu> = {
  title: "UI Effects/Nav/NavbarMenu",
  component: Menu,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Menu>;

// The navbar surface uses bg-white/dark:bg-black; on a default background
// the contrast can be ambiguous. The Stage paints a soft gradient backdrop
// so the menu and its dropdowns stand out at any theme.
const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex min-h-[480px] w-full items-start justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 p-10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
    {children}
  </div>
);

/**
 * Default — three menu items with stacked dropdowns. Hover any label to
 * reveal its panel; the active panel uses a shared `layoutId` so the surface
 * morphs smoothly between items.
 */
export const Default: Story = {
  render: () => {
    const [active, setActive] = useState<string | null>(null);
    return (
      <Stage>
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Services">
            <div className="flex flex-col space-y-3 text-sm">
              <HoveredLink href="#a">Web Development</HoveredLink>
              <HoveredLink href="#b">Mobile Apps</HoveredLink>
              <HoveredLink href="#c">SEO &amp; Analytics</HoveredLink>
              <HoveredLink href="#d">Branding</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Products">
            <div className="grid grid-cols-2 gap-10 p-4 text-sm">
              <ProductItem
                title="Algochurn"
                description="Prepare for tech interviews like never before."
                href="#alg"
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
              />
              <ProductItem
                title="Tailwind Master Kit"
                description="Production-ready Tailwind components."
                href="#tmk"
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"
              />
              <ProductItem
                title="Moonbeam"
                description="Never write from scratch again."
                href="#moon"
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
              />
              <ProductItem
                title="Rogue"
                description="Automate your sales workflows."
                href="#rg"
                src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"
              />
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Pricing">
            <div className="flex flex-col space-y-3 text-sm">
              <HoveredLink href="#starter">Starter — $19</HoveredLink>
              <HoveredLink href="#studio">Studio — $99</HoveredLink>
              <HoveredLink href="#agency">Agency — $499</HoveredLink>
              <HoveredLink href="#enterprise">Enterprise</HoveredLink>
            </div>
          </MenuItem>
        </Menu>
      </Stage>
    );
  },
};

/** Two items — minimum viable nav. */
export const TwoItems: Story = {
  render: () => {
    const [active, setActive] = useState<string | null>(null);
    return (
      <Stage>
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Docs">
            <div className="flex flex-col space-y-3 text-sm">
              <HoveredLink href="#getting-started">Getting started</HoveredLink>
              <HoveredLink href="#guides">Guides</HoveredLink>
              <HoveredLink href="#api">API reference</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Blog">
            <div className="flex flex-col space-y-3 text-sm">
              <HoveredLink href="#latest">Latest posts</HoveredLink>
              <HoveredLink href="#archive">Archive</HoveredLink>
            </div>
          </MenuItem>
        </Menu>
      </Stage>
    );
  },
};

/** Many items — six links exercise the horizontal layout. */
export const ManyItems: Story = {
  render: () => {
    const [active, setActive] = useState<string | null>(null);
    return (
      <Stage>
        <Menu setActive={setActive}>
          {["Home", "Work", "Services", "Pricing", "Blog", "Contact"].map((item) => (
            <MenuItem key={item} setActive={setActive} active={active} item={item}>
              <div className="flex flex-col space-y-3 p-2 text-sm">
                <HoveredLink href={`#${item.toLowerCase()}-1`}>
                  {item} overview
                </HoveredLink>
                <HoveredLink href={`#${item.toLowerCase()}-2`}>
                  {item} details
                </HoveredLink>
              </div>
            </MenuItem>
          ))}
        </Menu>
      </Stage>
    );
  },
};
