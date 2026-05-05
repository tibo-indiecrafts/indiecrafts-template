import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Logo } from "@/components/layouts/_shared/logo";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar,
  NavbarButton,
} from "./resizable-navbar";
// `NavbarLogo` from the upstream primitive hardcodes an Aceternity asset URL.
// Use the project's `Logo` (reads from `siteConfig.logo`) so the demo shows
// the brand mark, not the upstream's logo.

const meta: Meta<typeof Navbar> = {
  title: "UI Effects/Nav/ResizableNavbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Navbar>;

const ITEMS = [
  { name: "Features", link: "#features" },
  { name: "Pricing", link: "#pricing" },
  { name: "About", link: "#about" },
  { name: "Contact", link: "#contact" },
];

const MANY_ITEMS = [
  ...ITEMS,
  { name: "Blog", link: "#blog" },
  { name: "Careers", link: "#careers" },
  { name: "Docs", link: "#docs" },
];

function NavbarShell({
  items,
  ctaVariant = "primary",
  ctaLabel = "Sign in",
}: {
  items: { name: string; link: string }[];
  ctaVariant?: "primary" | "secondary" | "dark" | "gradient";
  ctaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Navbar>
      <NavBody>
        <Logo />
        <NavItems items={items} />
        <NavbarButton href="#cta" variant={ctaVariant}>
          {ctaLabel}
        </NavbarButton>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <Logo />
          <MobileNavToggle isOpen={open} onClick={() => setOpen((o) => !o)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={open} onClose={() => setOpen(false)}>
          {items.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="text-foreground w-full py-2 text-base"
            >
              {item.name}
            </a>
          ))}
          <NavbarButton href="#cta" variant={ctaVariant} className="mt-4 w-full">
            {ctaLabel}
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background h-[200vh] w-full">
    {children}
    <div className="text-foreground mx-auto max-w-2xl px-6 py-40">
      <h1 className="text-4xl font-bold">Resizable navbar demo</h1>
      <p className="text-muted-foreground mt-4">
        Scroll to see the navbar shrink into a pill at the top of the viewport.
      </p>
    </div>
  </div>
);

/**
 * Default — full-width navbar at rest; on scroll the body shrinks and floats
 * as a pinned pill. Resize the canvas under `md` to see the mobile variant
 * with the hamburger toggle.
 */
export const Default: Story = {
  render: () => (
    <Page>
      <NavbarShell items={ITEMS} />
    </Page>
  ),
};

/** Many items — seven nav links exercise the horizontal layout. */
export const ManyItems: Story = {
  render: () => (
    <Page>
      <NavbarShell items={MANY_ITEMS} />
    </Page>
  ),
};

/** Gradient CTA — `variant="gradient"` paints the button blue. */
export const GradientCta: Story = {
  render: () => (
    <Page>
      <NavbarShell items={ITEMS} ctaVariant="gradient" ctaLabel="Try free" />
    </Page>
  ),
};

/** Dark CTA — `variant="dark"` for a high-contrast pill. */
export const DarkCta: Story = {
  render: () => (
    <Page>
      <NavbarShell items={ITEMS} ctaVariant="dark" ctaLabel="Get the kit" />
    </Page>
  ),
};
