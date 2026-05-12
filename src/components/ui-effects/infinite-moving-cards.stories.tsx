/* eslint-disable @typescript-eslint/ban-ts-comment -- ts-nocheck below */
// @ts-nocheck -- Aceternity / MagicUI upstream; type quirks (React 19 ref-null types, missing JSX namespace, etc.) accepted as-is.
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InfiniteMovingCards } from "./infinite-moving-cards";

const meta: Meta<typeof InfiniteMovingCards> = {
  title: "UI Effects/Marquees & Scroll/InfiniteMovingCards",
  component: InfiniteMovingCards,
  parameters: { layout: "fullscreen" },
  argTypes: {
    direction: { control: "inline-radio", options: ["left", "right"] },
    speed: { control: "inline-radio", options: ["fast", "normal", "slow"] },
    pauseOnHover: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof InfiniteMovingCards>;

const ITEMS = [
  {
    quote:
      "We replaced four bespoke marketing sites with this template — only config files differ between them now.",
    name: "Sarah Chen",
    title: "Product Engineer at Linear",
  },
  {
    quote:
      "The accessibility defaults alone are worth the price of admission. Our QA team flagged zero a11y issues on the first audit.",
    name: "Marcus Rivera",
    title: "Lead Designer at Vercel",
  },
  {
    quote:
      "Finally a Next.js template that doesn't fight me when I add a third locale. Translations live next to the page they belong to.",
    name: "Aisha Patel",
    title: "Frontend Architect at Stripe",
  },
  {
    quote:
      "We forked it for three client sites and only changed the config files. Real reusability, not just talk.",
    name: "Theo Dubois",
    title: "Agency Owner at Indiecrafts",
  },
  {
    quote: "The theme tokens survive a brand refresh without a single component rewrite.",
    name: "Mariana Costa",
    title: "Tech Lead at Grafana Labs",
  },
];

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex h-[20rem] items-center justify-center">
    {children}
  </div>
);

export const Default: Story = {
  args: { direction: "left", speed: "slow", pauseOnHover: true },
  render: (args) => (
    <Stage>
      <InfiniteMovingCards items={ITEMS} {...args} />
    </Stage>
  ),
};

export const Reverse: Story = {
  args: { direction: "right", speed: "normal", pauseOnHover: true },
  render: (args) => (
    <Stage>
      <InfiniteMovingCards items={ITEMS} {...args} />
    </Stage>
  ),
};

export const Fast: Story = {
  args: { direction: "left", speed: "fast", pauseOnHover: true },
  render: (args) => (
    <Stage>
      <InfiniteMovingCards items={ITEMS} {...args} />
    </Stage>
  ),
};

export const NoPauseOnHover: Story = {
  args: { direction: "left", speed: "normal", pauseOnHover: false },
  render: (args) => (
    <Stage>
      <InfiniteMovingCards items={ITEMS} {...args} />
    </Stage>
  ),
};

export const FewItems: Story = {
  args: { direction: "left", speed: "slow" },
  render: (args) => (
    <Stage>
      <InfiniteMovingCards items={ITEMS.slice(0, 3)} {...args} />
    </Stage>
  ),
};
