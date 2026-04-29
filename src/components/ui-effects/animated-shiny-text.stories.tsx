import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight } from "lucide-react";
import { AnimatedShinyText } from "./animated-shiny-text";

const meta: Meta<typeof AnimatedShinyText> = {
  title: "UI Effects/AnimatedShinyText",
  component: AnimatedShinyText,
  parameters: { layout: "centered" },
  argTypes: {
    shimmerWidth: { control: { type: "range", min: 50, max: 400, step: 10 } },
  },
};
export default meta;

type Story = StoryObj<typeof AnimatedShinyText>;

/** Default — gradient sweep across muted text. */
export const Default: Story = {
  render: () => (
    <p className="text-2xl font-semibold">
      <AnimatedShinyText>Introducing the new dashboard</AnimatedShinyText>
    </p>
  ),
};

/** Common "✨ New" pill pattern — used as a marketing badge. */
export const Pill: Story = {
  render: () => (
    <div className="bg-foreground/5 ring-foreground/5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 ring-1">
      <span aria-hidden>✨</span>
      <AnimatedShinyText className="text-sm">
        New: AI-assisted onboarding
      </AnimatedShinyText>
      <ArrowRight className="text-muted-foreground size-4" />
    </div>
  ),
};

/** Wider shimmer — `shimmerWidth={300}` slows the perceived sweep. */
export const WideShimmer: Story = {
  render: () => (
    <p className="text-2xl font-semibold">
      <AnimatedShinyText shimmerWidth={300}>
        Wide shimmer (300px)
      </AnimatedShinyText>
    </p>
  ),
};

/** Narrow shimmer — tight 50px highlight band. */
export const NarrowShimmer: Story = {
  render: () => (
    <p className="text-2xl font-semibold">
      <AnimatedShinyText shimmerWidth={50}>
        Narrow shimmer (50px)
      </AnimatedShinyText>
    </p>
  ),
};

/** Multiple lines — wraps and animates over the full text block. */
export const Paragraph: Story = {
  render: () => (
    <p className="max-w-md text-base leading-relaxed">
      <AnimatedShinyText>
        Build software that connects every layer of your business — from on-call
        rotations to release notes to the customer support inbox. One platform, one
        source of truth.
      </AnimatedShinyText>
    </p>
  ),
};
