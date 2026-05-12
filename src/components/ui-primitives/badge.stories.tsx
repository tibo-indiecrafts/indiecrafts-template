import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Check, X } from "lucide-react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "UI Primitives/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "Badge" } };

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>
        <Check />
        Active
      </Badge>
      <Badge variant="destructive">
        <X />
        Expired
      </Badge>
      <Badge variant="outline">
        <Check />
        Verified
      </Badge>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Badge asChild>
      <a href="#changelog">v1.4 changelog</a>
    </Badge>
  ),
};
