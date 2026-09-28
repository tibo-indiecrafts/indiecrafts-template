import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import docs from "./button.md?raw";

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "link",
  "destructive",
] as const;
const SIZES = ["xs", "sm", "default", "lg"] as const;

const meta = {
  title: "Web/UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: docs } },
  },
  args: { children: "Save changes", variant: "default", size: "default" },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: {
      control: "select",
      options: [...SIZES, "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
