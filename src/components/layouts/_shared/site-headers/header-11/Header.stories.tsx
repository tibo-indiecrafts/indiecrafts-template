import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BubbleMenu, type BubbleMenuItem } from "./BubbleMenu";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  title: "Layouts/Shared/SiteHeaders/Header11",
  component: Header,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Header>;

// Mirrors the upstream snippet 1:1 — hardcoded items, no i18n. Useful to
// verify the BubbleMenu primitive itself when the translated `Default`
// story renders unexpectedly.
const SNIPPET_ITEMS: BubbleMenuItem[] = [
  {
    label: "home",
    href: "#",
    ariaLabel: "Home",
    rotation: -8,
    hoverStyles: { bgColor: "#3b82f6", textColor: "#ffffff" },
  },
  {
    label: "about",
    href: "#",
    ariaLabel: "About",
    rotation: 8,
    hoverStyles: { bgColor: "#10b981", textColor: "#ffffff" },
  },
  {
    label: "projects",
    href: "#",
    ariaLabel: "Projects",
    rotation: 8,
    hoverStyles: { bgColor: "#f59e0b", textColor: "#ffffff" },
  },
  {
    label: "blog",
    href: "#",
    ariaLabel: "Blog",
    rotation: 8,
    hoverStyles: { bgColor: "#ef4444", textColor: "#ffffff" },
  },
  {
    label: "contact",
    href: "#",
    ariaLabel: "Contact",
    rotation: -8,
    hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" },
  },
];

export const Default: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-neutral-100">
      <Header />
    </div>
  ),
};

export const RawPrimitive: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-neutral-100">
      <BubbleMenu
        logo={<span style={{ fontWeight: 700 }}>RB</span>}
        items={SNIPPET_ITEMS}
        menuAriaLabel="Toggle navigation"
        menuBg="#ffffff"
        menuContentColor="#111111"
        useFixedPosition={false}
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.12}
      />
    </div>
  ),
};
