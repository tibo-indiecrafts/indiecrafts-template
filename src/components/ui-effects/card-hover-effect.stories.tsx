import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HoverEffect } from "./card-hover-effect";

const meta: Meta<typeof HoverEffect> = {
  title: "UI Effects/CardHoverEffect",
  component: HoverEffect,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HoverEffect>;

const ITEMS = [
  {
    title: "Config-first",
    description:
      "Edit a single TypeScript file to change your brand, your nav, your locales. Zero component rewrites.",
    link: "#config",
  },
  {
    title: "Type-safe i18n",
    description:
      "Every translation key flows through a MessageKey union, so typos surface as compile errors.",
    link: "#i18n",
  },
  {
    title: "Accessible defaults",
    description:
      "WCAG 2.1 AA out of the box. Skip links, focus rings, semantic landmarks already wired up.",
    link: "#a11y",
  },
  {
    title: "React 19 + Next 16",
    description:
      "React Compiler enabled, Turbopack dev server, partial prerendering ready when you need it.",
    link: "#stack",
  },
  {
    title: "Per-page sections",
    description:
      "Each page declares an ordered list of typed section blocks. Add a hero, swap it for a grid.",
    link: "#sections",
  },
  {
    title: "Open licensing",
    description:
      "Fork it, ship it, sell it. No royalties, no per-seat fees, no upgrade traps.",
    link: "#license",
  },
];

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background min-h-svh w-full">
    <div className="mx-auto w-full max-w-5xl px-6 py-10">{children}</div>
  </div>
);

/** Default — 3 column grid; hovering an item slides a subtle background pill. */
export const Default: Story = {
  render: () => (
    <Frame>
      <HoverEffect items={ITEMS} />
    </Frame>
  ),
};

/** Three items — exercises the layoutId slide between adjacent cards. */
export const ThreeItems: Story = {
  render: () => (
    <Frame>
      <HoverEffect items={ITEMS.slice(0, 3)} />
    </Frame>
  ),
};

/** Single item — degenerate case; the hover background still fades in. */
export const Single: Story = {
  render: () => (
    <Frame>
      <HoverEffect items={[ITEMS[0]]} />
    </Frame>
  ),
};

/** Custom column count — `className="lg:grid-cols-2"` halves the column count. */
export const TwoColumns: Story = {
  render: () => (
    <Frame>
      <HoverEffect items={ITEMS} className="lg:grid-cols-2" />
    </Frame>
  ),
};
