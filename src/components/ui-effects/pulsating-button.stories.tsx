import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PulsatingButton } from "./pulsating-button";

const meta: Meta<typeof PulsatingButton> = {
  title: "UI Effects/PulsatingButton",
  component: PulsatingButton,
  parameters: { layout: "centered" },
  argTypes: {
    duration: { control: "text" },
    distance: { control: "text" },
    pulseColor: { control: "color" },
    variant: { control: "inline-radio", options: ["pulse", "ripple"] },
  },
};
export default meta;

type Story = StoryObj<typeof PulsatingButton>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] items-center justify-center p-12">
    {children}
  </div>
);

/**
 * Default — brand-coloured button with a pulse halo at 1.5s and 8px reach.
 * The halo colour auto-tracks the button&apos;s computed background unless
 * `pulseColor` is set explicitly.
 */
export const Default: Story = {
  args: { duration: "1.5s", distance: "8px", variant: "pulse" },
  render: (args) => (
    <Stage>
      <PulsatingButton {...args}>Get started</PulsatingButton>
    </Stage>
  ),
};

/** Ripple variant — `variant="ripple"` swaps the halo for an outward ring. */
export const Ripple: Story = {
  args: { variant: "ripple", duration: "1.5s", distance: "10px" },
  render: (args) => (
    <Stage>
      <PulsatingButton {...args}>Subscribe</PulsatingButton>
    </Stage>
  ),
};

/** Custom colour — `pulseColor="#ec4899"` overrides the auto-tracked tone. */
export const CustomColor: Story = {
  args: { pulseColor: "#ec4899", duration: "2s" },
  render: (args) => (
    <Stage>
      <PulsatingButton
        {...args}
        className="bg-pink-600 text-white hover:bg-pink-500"
      >
        Try free
      </PulsatingButton>
    </Stage>
  ),
};

/** Slower — `duration="3s"` for a more deliberate pulse. */
export const Slow: Story = {
  args: { duration: "3s", distance: "12px" },
  render: (args) => (
    <Stage>
      <PulsatingButton {...args}>Calm pulse</PulsatingButton>
    </Stage>
  ),
};

/** Larger — adds Tailwind utilities for a hero-scale CTA. */
export const Larger: Story = {
  render: () => (
    <Stage>
      <PulsatingButton className="px-8 py-3 text-lg">
        Try the demo
      </PulsatingButton>
    </Stage>
  ),
};
