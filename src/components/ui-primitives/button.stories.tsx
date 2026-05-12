import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mail } from "lucide-react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI Primitives/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "xs", "icon-sm", "icon-lg", "icon-xs"],
    },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Click me" } };

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="icon-xs" variant="outline">
        <Mail />
        <span className="sr-only">Mail</span>
      </Button>
      <Button size="icon-sm" variant="outline">
        <Mail />
        <span className="sr-only">Mail</span>
      </Button>
      <Button size="icon" variant="outline">
        <Mail />
        <span className="sr-only">Mail</span>
      </Button>
      <Button size="icon-lg" variant="outline">
        <Mail />
        <span className="sr-only">Mail</span>
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Default</Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Button asChild>
      <a href="https://example.com" target="_blank" rel="noreferrer">
        Open example.com
      </a>
    </Button>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Mail />
      Send email
    </Button>
  ),
};
