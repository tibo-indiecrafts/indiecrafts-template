import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero } from "./Hero";
import docs from "./Hero.md?raw";

const meta = {
  title: "Web/UI Components/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: docs } },
  },
  args: {
    _type: "module.hero",
    eyebrow: "Config-first",
    title: "Ship client sites [[faster]]",
    subtitle: "One modular codebase, every brand. Configure, don't fork.",
    cta: { link: { label: "Get started", href: "/start" }, variant: "primary" },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoCta: Story = { args: { cta: undefined } };
export const TitleOnly: Story = {
  args: { eyebrow: undefined, subtitle: undefined, cta: undefined },
};
