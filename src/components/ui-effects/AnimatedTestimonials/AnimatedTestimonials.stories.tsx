import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatedTestimonials } from "./AnimatedTestimonials";

const meta: Meta<typeof AnimatedTestimonials> = {
  title: "UI Effects/AnimatedTestimonials",
  component: AnimatedTestimonials,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AnimatedTestimonials>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[520px] w-[900px] max-w-full items-center justify-center">
    {children}
  </div>
);

/** Defaults — translated quotes/names from `blocks.animated-testimonials.*`. */
export const Default: Story = {
  render: () => (
    <Stage>
      <AnimatedTestimonials />
    </Stage>
  ),
};

/** Autoplay — rotates every few seconds without user interaction. */
export const Autoplay: Story = {
  render: () => (
    <Stage>
      <AnimatedTestimonials autoplay />
    </Stage>
  ),
};
