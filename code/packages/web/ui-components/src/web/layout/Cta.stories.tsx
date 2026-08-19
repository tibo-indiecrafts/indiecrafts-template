import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModuleCta } from "./Cta";
import docs from "./Cta.md?raw";

const meta = {
  title: "UI Components/ModuleCta",
  component: ModuleCta,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: docs } },
  },
  args: {
    cta: { link: { label: "Get started", href: "/start" }, variant: "primary" },
  },
} satisfies Meta<typeof ModuleCta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = {
  args: {
    cta: { link: { label: "Learn more", href: "/x" }, variant: "secondary" },
  },
};
export const Ghost: Story = {
  args: { cta: { link: { label: "Skip", href: "/x" }, variant: "ghost" } },
};
