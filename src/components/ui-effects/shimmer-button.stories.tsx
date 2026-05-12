import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShimmerButton } from "./shimmer-button";

const meta: Meta<typeof ShimmerButton> = {
  title: "UI Effects/Buttons/ShimmerButton",
  component: ShimmerButton,
  parameters: { layout: "centered" },
  argTypes: {
    shimmerColor: { control: "color" },
    shimmerSize: { control: "text" },
    shimmerDuration: { control: "text" },
    borderRadius: { control: "text" },
    background: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof ShimmerButton>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] items-center justify-center p-12">
    {children}
  </div>
);

export const Default: Story = {
  args: { shimmerColor: "#ffffff", shimmerDuration: "3s" },
  render: (args) => (
    <Stage>
      <ShimmerButton {...args}>Get started</ShimmerButton>
    </Stage>
  ),
};

export const BrandBackground: Story = {
  args: {
    background: "rgba(15, 23, 42, 1)",
    shimmerColor: "var(--color-primary)",
    shimmerDuration: "2.5s",
  },
  render: (args) => (
    <Stage>
      <ShimmerButton {...args}>Indiecrafts</ShimmerButton>
    </Stage>
  ),
};

export const PinkShimmer: Story = {
  args: { shimmerColor: "#ec4899", background: "rgba(15, 23, 42, 1)" },
  render: (args) => (
    <Stage>
      <ShimmerButton {...args}>Try free</ShimmerButton>
    </Stage>
  ),
};

export const Squared: Story = {
  args: { borderRadius: "0.5rem" },
  render: (args) => (
    <Stage>
      <ShimmerButton {...args}>Square pill</ShimmerButton>
    </Stage>
  ),
};

export const Slow: Story = {
  args: { shimmerDuration: "6s" },
  render: (args) => (
    <Stage>
      <ShimmerButton {...args}>Slow shimmer</ShimmerButton>
    </Stage>
  ),
};

export const Large: Story = {
  render: () => (
    <Stage>
      <ShimmerButton className="px-10 py-4 text-base">Try the demo</ShimmerButton>
    </Stage>
  ),
};
