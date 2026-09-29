import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pricing } from "./Pricing";
import docs from "./Pricing.md?raw";

const tiers = [
  {
    _key: "t1",
    name: "Starter",
    price: "$0",
    period: "/mo",
    description: "For side projects.",
    features: ["1 site", "Community support", "Blog module"],
    cta: {
      link: { label: "Start free", href: "/start" },
      variant: "secondary" as const,
    },
  },
  {
    _key: "t2",
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For growing brands.",
    highlighted: true,
    badge: "Most popular",
    features: ["Unlimited sites", "Priority support", "All modules"],
    cta: {
      link: { label: "Go Pro", href: "/start" },
      variant: "primary" as const,
    },
  },
  {
    _key: "t3",
    name: "Agency",
    price: "$99",
    period: "/mo",
    description: "For teams shipping many clients.",
    features: ["White-label", "Dedicated support", "Custom modules"],
    cta: {
      link: { label: "Contact sales", href: "/contact" },
      variant: "secondary" as const,
    },
  },
];

const meta = {
  title: "UI Components/Pricing",
  component: Pricing,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    _type: "module.pricing",
    title: "Simple pricing",
    intro: "No hidden fees.",
    tiers,
  },
  argTypes: {
    tiers: { table: { disable: true } },
  },
} satisfies Meta<typeof Pricing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoHeader: Story = { args: { title: undefined, intro: undefined } };
export const SingleTier: Story = { args: { tiers: tiers.slice(1, 2) } };
