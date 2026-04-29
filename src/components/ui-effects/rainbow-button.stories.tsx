import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight, Sparkles } from "lucide-react";
import { RainbowButton } from "./rainbow-button";

const meta: Meta<typeof RainbowButton> = {
  title: "UI Effects/RainbowButton",
  component: RainbowButton,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["sm", "default", "lg", "icon"] },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof RainbowButton>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] items-center justify-center p-10">
    {children}
  </div>
);

/**
 * Default — solid background with a five-stop rainbow border + glow that
 * animates across the button via the `--animate-rainbow` keyframes.
 */
export const Default: Story = {
  args: { variant: "default", size: "default" },
  render: (args) => (
    <Stage>
      <RainbowButton {...args}>Get started</RainbowButton>
    </Stage>
  ),
};

/** Outline — `variant="outline"` keeps the rainbow ring on a light surface. */
export const Outline: Story = {
  args: { variant: "outline", size: "default" },
  render: (args) => (
    <Stage>
      <RainbowButton {...args}>Outline</RainbowButton>
    </Stage>
  ),
};

/** Sizes — `sm`, `default`, `lg` exposed via the `size` prop. */
export const Sizes: Story = {
  render: () => (
    <Stage>
      <div className="flex items-center gap-4">
        <RainbowButton size="sm">Small</RainbowButton>
        <RainbowButton size="default">Default</RainbowButton>
        <RainbowButton size="lg">Large</RainbowButton>
      </div>
    </Stage>
  ),
};

/** Icon — `size="icon"` renders a square button. */
export const Icon: Story = {
  render: () => (
    <Stage>
      <RainbowButton size="icon" aria-label="Get started">
        <ArrowRight />
      </RainbowButton>
    </Stage>
  ),
};

/** With icon — children compose with `lucide-react` icons cleanly. */
export const WithIcon: Story = {
  render: () => (
    <Stage>
      <RainbowButton>
        <Sparkles />
        Make it sparkle
        <ArrowRight />
      </RainbowButton>
    </Stage>
  ),
};

/** Disabled — `disabled` halts pointer events and dims the button. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Stage>
      <RainbowButton {...args}>Unavailable</RainbowButton>
    </Stage>
  ),
};
