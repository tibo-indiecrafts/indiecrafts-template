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

/**
 * Default — black pill with a white conic-gradient spark sliding around the
 * border every 3s. The shimmer rides on a `--cut`-thick strip outside the
 * inner background.
 */
export const Default: Story = {
  args: { shimmerColor: "#ffffff", shimmerDuration: "3s" },
  render: (args) => (
    <Stage>
      <ShimmerButton {...args}>Get started</ShimmerButton>
    </Stage>
  ),
};

/**
 * Brand background — `background` retunes the inner fill and `shimmerColor`
 * reads from the `--color-primary` token so the spark stays brand-aligned.
 */
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

/** Pink shimmer — `shimmerColor` controls the spark hue. */
export const PinkShimmer: Story = {
  args: { shimmerColor: "#ec4899", background: "rgba(15, 23, 42, 1)" },
  render: (args) => (
    <Stage>
      <ShimmerButton {...args}>Try free</ShimmerButton>
    </Stage>
  ),
};

/** Square corners — `borderRadius="0.5rem"` for an architectural look. */
export const Squared: Story = {
  args: { borderRadius: "0.5rem" },
  render: (args) => (
    <Stage>
      <ShimmerButton {...args}>Square pill</ShimmerButton>
    </Stage>
  ),
};

/** Slow — `shimmerDuration="6s"` for a more deliberate pulse. */
export const Slow: Story = {
  args: { shimmerDuration: "6s" },
  render: (args) => (
    <Stage>
      <ShimmerButton {...args}>Slow shimmer</ShimmerButton>
    </Stage>
  ),
};

/** Large — Tailwind utilities scale up to a hero CTA. */
export const Large: Story = {
  render: () => (
    <Stage>
      <ShimmerButton className="px-10 py-4 text-base">Try the demo</ShimmerButton>
    </Stage>
  ),
};
