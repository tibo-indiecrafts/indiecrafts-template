import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HyperText } from "./hyper-text";

const meta: Meta<typeof HyperText> = {
  title: "UI Effects/Text/HyperText",
  component: HyperText,
  parameters: { layout: "centered" },
  argTypes: {
    duration: { control: { type: "range", min: 200, max: 3000, step: 100 } },
    delay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    animateOnHover: { control: "boolean" },
    startOnView: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof HyperText>;

export const Default: Story = {
  args: { duration: 800, delay: 0, animateOnHover: true },
  render: (args) => <HyperText {...args}>Hover me</HyperText>,
};

export const Heading: Story = {
  args: { duration: 1200, delay: 0 },
  render: (args) => (
    <HyperText {...args} as="h1" className="text-foreground text-6xl font-bold">
      Indiecrafts
    </HyperText>
  ),
};

export const Slow: Story = {
  args: { duration: 2400, delay: 0 },
  render: (args) => (
    <HyperText {...args} className="text-foreground text-4xl font-bold">
      Slowly resolving
    </HyperText>
  ),
};

export const CustomCharset: Story = {
  args: {
    duration: 1500,
    characterSet: "0123456789!@#$%&*?".split(""),
  },
  render: (args) => (
    <HyperText {...args} className="text-foreground text-4xl font-bold">
      Hex Crash
    </HyperText>
  ),
};

export const HoverOnly: Story = {
  args: { duration: 800, animateOnHover: true },
  render: (args) => (
    <HyperText {...args} className="text-foreground cursor-pointer text-3xl font-bold">
      Hover to rescramble
    </HyperText>
  ),
};

export const Delayed: Story = {
  args: { duration: 1000, delay: 1000 },
  render: (args) => (
    <HyperText {...args} className="text-foreground text-4xl font-bold">
      One-second delay
    </HyperText>
  ),
};
