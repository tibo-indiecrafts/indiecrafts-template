import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatedGradientText } from "./animated-gradient-text";

const meta: Meta<typeof AnimatedGradientText> = {
  title: "UI Effects/AnimatedGradientText",
  component: AnimatedGradientText,
  parameters: { layout: "centered" },
  argTypes: {
    speed: { control: { type: "range", min: 0.25, max: 4, step: 0.25 } },
    colorFrom: { control: "color" },
    colorTo: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof AnimatedGradientText>;

/** Default warm gradient — wraps inline text. */
export const Default: Story = {
  render: () => (
    <h1 className="text-4xl font-bold">
      <AnimatedGradientText>Build something amazing</AnimatedGradientText>
    </h1>
  ),
};

/** Custom palette — `colorFrom` / `colorTo` retune the sweep. */
export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3 text-3xl font-bold">
      <AnimatedGradientText colorFrom="#22d3ee" colorTo="#a855f7">
        Cyan to violet
      </AnimatedGradientText>
      <AnimatedGradientText colorFrom="#10b981" colorTo="#facc15">
        Emerald to gold
      </AnimatedGradientText>
      <AnimatedGradientText colorFrom="#ef4444" colorTo="#f97316">
        Crimson to orange
      </AnimatedGradientText>
    </div>
  ),
};

/** Speed scale — slower (0.5) and faster (3) sweeps. */
export const Speeds: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3 text-3xl font-bold">
      <AnimatedGradientText speed={0.5}>Slow (0.5×)</AnimatedGradientText>
      <AnimatedGradientText>Default (1×)</AnimatedGradientText>
      <AnimatedGradientText speed={3}>Fast (3×)</AnimatedGradientText>
    </div>
  ),
};

/** Inline within a paragraph — shows it composes with regular prose. */
export const Inline: Story = {
  render: () => (
    <p className="max-w-md text-center text-base">
      Welcome back —{" "}
      <AnimatedGradientText className="text-base font-semibold">
        let's get to work
      </AnimatedGradientText>
      . You have three pull requests waiting for review.
    </p>
  ),
};
