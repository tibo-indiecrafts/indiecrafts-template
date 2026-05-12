import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RippleButton } from "./ripple-button";

const meta: Meta<typeof RippleButton> = {
  title: "UI Effects/Buttons/RippleButton",
  component: RippleButton,
  parameters: { layout: "centered" },
  argTypes: {
    rippleColor: { control: "color" },
    duration: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof RippleButton>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] items-center justify-center p-10">
    {children}
  </div>
);

export const Default: Story = {
  args: { rippleColor: "#3b82f6", duration: "600ms" },
  render: (args) => (
    <Stage>
      <RippleButton {...args}>Click me</RippleButton>
    </Stage>
  ),
};

export const PinkRipple: Story = {
  args: { rippleColor: "#ec4899", duration: "600ms" },
  render: (args) => (
    <Stage>
      <RippleButton
        {...args}
        className="border-pink-500 text-pink-500 hover:border-pink-400"
      >
        Pink pulse
      </RippleButton>
    </Stage>
  ),
};

export const Slow: Story = {
  args: { rippleColor: "#0ea5e9", duration: "1500ms" },
  render: (args) => (
    <Stage>
      <RippleButton {...args}>Slow ripple</RippleButton>
    </Stage>
  ),
};

export const Larger: Story = {
  render: () => (
    <Stage>
      <RippleButton className="px-10 py-3 text-lg" rippleColor="#06b6d4">
        Try the demo
      </RippleButton>
    </Stage>
  ),
};

export const SideBySide: Story = {
  render: () => (
    <Stage>
      <div className="flex gap-4">
        <RippleButton rippleColor="#3b82f6">Sign up</RippleButton>
        <RippleButton rippleColor="#10b981">Subscribe</RippleButton>
        <RippleButton rippleColor="#f59e0b">Upgrade</RippleButton>
      </div>
    </Stage>
  ),
};
